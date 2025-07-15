import {
	Component,
	signal,
	inject,
	ChangeDetectionStrategy,
	effect,
	OnDestroy,
} from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import {
	DiscordAuthService,
	DiscordUser,
} from "../services/discord-auth.service";
import {
	WordleIntegrationService,
	WordleUserData,
} from "../services/wordle-api.service";
import { ThemeService } from "../services/theme.service";
import { environment } from "../../environments/environment";

@Component({
	selector: "app-wordle-page",
	imports: [],
	templateUrl: "./wordle-page.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WordlePageComponent implements OnDestroy {
	isLoading = signal<boolean>(false);
	showWordle = signal<boolean>(false);
	currentRoute = "/wordle";
	iframeUrl = signal<SafeResourceUrl | null>(null);
	isAuthenticated = signal<boolean>(false);
	authCheckComplete = signal<boolean>(false);
	currentUser = signal<DiscordUser | null>(null);
	themeSync = signal<boolean>(false); // Track theme synchronization
	componentLoaded = signal<boolean>(false); // Track if component is loaded

	private discordAuth = inject(DiscordAuthService);
	private wordleIntegration = inject(WordleIntegrationService);
	private sanitizer = inject(DomSanitizer);
	private themeService = inject(ThemeService);
	private messageListener: ((event: MessageEvent) => void) | null = null;

	constructor() {
		// Initialize with sanitized URL
		this.iframeUrl.set(
			this.sanitizer.bypassSecurityTrustResourceUrl(environment.wordleGameUrl),
		);

		this.setupMessageListener();
		this.loadUserData();

		// Effect to update iframe URL when user changes
		effect(() => {
			const user = this.currentUser();
			if (user) {
				this.updateIframeUrl();
			}
		});

		// Effect to send theme updates to iframe
		effect(() => {
			const appliedTheme = this.themeService.appliedTheme();
			// Only reset theme sync for initial load, not when component is already loaded
			if (!this.componentLoaded()) {
				this.themeSync.set(false);
			}
			this.sendThemeToWordle(appliedTheme);

			// If component is already loaded, theme sync should complete quickly
			if (this.componentLoaded()) {
				setTimeout(() => {
					this.themeSync.set(true);
				}, 100);
			}
		});
	}

	ngOnDestroy() {
		// Reset state when component is destroyed
		this.componentLoaded.set(false);
		this.themeSync.set(false);
	}

	private setupMessageListener(): void {
		this.messageListener = this.wordleIntegration.setupMessageListener(
			(event) => {
				if (event.data.type === "REQUEST_USER_DATA") {
					this.sendUserDataToWordle(event.source as Window);
				} else if (event.data.type === "REQUEST_THEME") {
					// Send current theme immediately when requested
					const currentTheme = this.themeService.appliedTheme();
					this.sendThemeToWordle(currentTheme);
				} else if (event.data.type === "THEME_APPLIED") {
					// Child iframe has successfully applied the theme
					console.log("🎨 Theme applied in iframe");
					// Only set theme sync if component is loaded, otherwise wait for COMPONENT_READY
					if (this.componentLoaded()) {
						this.themeSync.set(true);
					}
				} else if (event.data.type === "COMPONENT_READY") {
					// Child component is fully loaded and ready
					console.log("🎯 Child component ready, hiding loader");
					this.componentLoaded.set(true);
					this.themeSync.set(true);
				} else if (event.data.type === "GAME_STATUS_UPDATE") {
					// Optional: Handle game status updates for hub UI
					console.log("Game status update:", event.data);
				}
			},
		);
	}

	private sendUserDataToWordle(targetWindow: Window): void {
		let userData: WordleUserData | null = null;

		const user = this.currentUser();
		if (user) {
			userData = {
				discordId: user.userId,
				username: user.username,
				avatar: this.discordAuth.getAvatarUrl(user),
			};
		}

		this.wordleIntegration.sendUserDataToWordle(targetWindow, userData);
	}

	private sendThemeToWordle(theme: "light" | "dark"): void {
		const iframe = document.querySelector("iframe") as HTMLIFrameElement;
		if (iframe?.contentWindow) {
			iframe.contentWindow.postMessage(
				{
					type: "THEME_UPDATE",
					theme: theme,
				},
				environment.wordleGameUrl,
			);
		}
	}

	private loadUserData(): void {
		// Subscribe to user data directly (not in an effect)
		this.discordAuth.user$.subscribe((user) => {
			this.currentUser.set(user);
			this.isAuthenticated.set(!!user);
			this.authCheckComplete.set(true);

			console.log("Wordle Page - Auth check:", {
				user: !!user,
				authenticated: this.isAuthenticated(),
			});

			if (this.isAuthenticated()) {
				// Only show the game if user is authenticated
				this.showWordle.set(true);
				this.updateIframeUrl();
			} else {
				// User is not authenticated - block access
				this.showWordle.set(false);
				console.log("Wordle Page - Blocking access: User not authenticated");
			}
		});
	}

	private updateIframeUrl(): void {
		const baseUrl = environment.wordleGameUrl;
		let finalUrl: string;

		const user = this.currentUser();
		if (user) {
			const params = new URLSearchParams({
				discordId: user.userId,
				username: user.username,
			});
			finalUrl = `${baseUrl}?${params.toString()}`;
		} else {
			finalUrl = baseUrl;
		}

		// Sanitize the URL for security
		this.iframeUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(finalUrl));
	}

	onIframeLoad(): void {
		this.isLoading.set(false);

		// Send initial data to the iframe once it loads - no timeout for faster communication
		const iframe = document.querySelector("iframe") as HTMLIFrameElement;
		if (iframe?.contentWindow) {
			// Send theme first to prevent flashing
			this.sendThemeToWordle(this.themeService.appliedTheme());
			this.sendUserDataToWordle(iframe.contentWindow);

			// Theme sync will be set to true when COMPONENT_READY message is received
			// Fallback: if no COMPONENT_READY message after 3 seconds, hide loader anyway
			setTimeout(() => {
				if (!this.themeSync()) {
					console.log("⚠️ Fallback: Hiding loader after timeout");
					this.themeSync.set(true);
				}
			}, 3000);
		}
	}

	onDiscordLogin(): void {
		this.discordAuth.login();
	}
}
