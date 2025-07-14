import { Component, OnInit, OnDestroy, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import {
	DiscordAuthService,
	DiscordUser,
} from "../services/discord-auth.service";
import {
	WordleIntegrationService,
	WordleUserData,
} from "../services/wordle-api.service";
import { environment } from "../../environments/environment";
import { Subscription } from "rxjs";

@Component({
	selector: "app-wordle-page",
	imports: [CommonModule, RouterModule],
	templateUrl: "./wordle-page.component.html",
})
export class WordlePageComponent implements OnInit, OnDestroy {
	isLoading = signal<boolean>(false);
	showWordle = signal<boolean>(false);
	currentRoute = "/wordle";
	iframeUrl: SafeResourceUrl;
	isAuthenticated = false;
	authCheckComplete = false;

	currentUser: DiscordUser | null = null;

	private subscriptions: Subscription[] = [];
	private messageListener: ((event: MessageEvent) => void) | null = null;

	constructor(
		public discordAuth: DiscordAuthService,
		private wordleIntegration: WordleIntegrationService,
		private sanitizer: DomSanitizer,
	) {
		// Initialize with sanitized URL
		this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
			environment.wordleGameUrl,
		);
	}

	ngOnInit() {
		this.setupMessageListener();
		this.loadUserData();

		// Don't start loading the game until authentication is verified
		// The game will only load if user is authenticated
	}

	ngOnDestroy() {
		this.subscriptions.forEach((sub) => sub.unsubscribe());
		if (this.messageListener) {
			this.wordleIntegration.removeMessageListener(this.messageListener);
		}
	}

	private setupMessageListener() {
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

	private sendUserDataToWordle(targetWindow: Window) {
		let userData: WordleUserData | null = null;

		if (this.currentUser) {
			userData = {
				discordId: this.currentUser.userId,
				username: this.currentUser.username,
				avatar: this.discordAuth.getAvatarUrl(this.currentUser),
			};
		}

		this.wordleIntegration.sendUserDataToWordle(targetWindow, userData);
	}

	private loadUserData() {
		const userSub = this.discordAuth.user$.subscribe((user) => {
			this.currentUser = user;
			this.isAuthenticated = !!user;
			this.authCheckComplete = true;
			console.log(
				"🚀 ~ WordlePageComponent ~ userSub ~ this.isAuthenticated:",
				this.isAuthenticated,
			);

			console.log("Wordle Page - Auth check:", {
				user: !!user,
				authenticated: this.isAuthenticated,
			});

			if (this.isAuthenticated) {
				// Only show the game if user is authenticated
				this.showWordle.set(true);
				this.updateIframeUrl();
			} else {
				// User is not authenticated - block access
				this.showWordle.set(false);
				console.log("Wordle Page - Blocking access: User not authenticated");
			}
		});
		this.subscriptions.push(userSub);
	}

	private updateIframeUrl() {
		const baseUrl = environment.wordleGameUrl;
		let finalUrl: string;

		if (this.currentUser) {
			const params = new URLSearchParams({
				discordId: this.currentUser.userId,
				username: this.currentUser.username,
			});
			finalUrl = `${baseUrl}?${params.toString()}`;
		} else {
			finalUrl = baseUrl;
		}

		// Sanitize the URL for security
		this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(finalUrl);
	}

	onIframeLoad() {
		this.isLoading.set(false);

		// Send initial data to the iframe once it loads
		setTimeout(() => {
			const iframe = document.querySelector("iframe") as HTMLIFrameElement;
			if (iframe?.contentWindow) {
				this.sendUserDataToWordle(iframe.contentWindow);
			}
		}, 1000);
	}

	onDiscordLogin(): void {
		this.discordAuth.login();
	}
}
