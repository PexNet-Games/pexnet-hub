import {
	Component,
	signal,
	inject,
	ChangeDetectionStrategy,
	effect,
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
export class WordlePageComponent {
	isLoading = signal<boolean>(false);
	showWordle = signal<boolean>(false);
	currentRoute = "/wordle";
	iframeUrl = signal<SafeResourceUrl | null>(null);
	isAuthenticated = signal<boolean>(false);
	authCheckComplete = signal<boolean>(false);
	currentUser = signal<DiscordUser | null>(null);

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
			this.sendThemeToWordle(appliedTheme);
		});
	}

	private setupMessageListener(): void {
		this.messageListener = this.wordleIntegration.setupMessageListener(
			(event) => {
				if (event.data.type === "REQUEST_USER_DATA") {
					this.sendUserDataToWordle(event.source as Window);
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

		// Send initial data to the iframe once it loads
		setTimeout(() => {
			const iframe = document.querySelector("iframe") as HTMLIFrameElement;
			if (iframe?.contentWindow) {
				this.sendUserDataToWordle(iframe.contentWindow);
				// Also send current theme
				this.sendThemeToWordle(this.themeService.appliedTheme());
			}
		}, 1000);
	}

	onDiscordLogin(): void {
		this.discordAuth.login();
	}
}
