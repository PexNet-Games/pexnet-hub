import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router, RouterOutlet, NavigationEnd } from "@angular/router";
import { filter } from "rxjs/operators";
import { HeaderComponent } from "./header/header.component";
import { DiscordAuthService } from "./services/discord-auth.service";

@Component({
	selector: "app-root",
	imports: [RouterOutlet, CommonModule, HeaderComponent],
	templateUrl: "./app.component.html",
	styleUrl: "./app.component.scss",
})
export class AppComponent implements OnInit {
	title = "pexnet-hub";
	showWordle = false;
	currentRoute = "/home";

	// Iframe properties
	iframeLoaded = false;
	iframeError = false;

	constructor(
		private router: Router,
		private discordAuthService: DiscordAuthService,
	) {}

	ngOnInit() {
		// Listen to route changes
		this.router.events
			.pipe(filter((event) => event instanceof NavigationEnd))
			.subscribe((event: NavigationEnd) => {
				this.currentRoute = event.url;
				const wasShowingWordle = this.showWordle;
				this.showWordle = event.url === "/wordle";

				// Only reset iframe state when transitioning TO Wordle (not when already showing)
				if (this.showWordle && !wasShowingWordle) {
					this.iframeLoaded = false;
					this.iframeError = false;
				}
			});

		// Set initial route based on current URL
		this.currentRoute = this.router.url;
		this.showWordle = this.router.url === "/wordle";

		// Initialize Discord authentication check
		this.discordAuthService.checkAuthStatus();
	}

	navigateToHome() {
		this.router.navigate(["/home"]);
	}

	navigateToWordle() {
		this.router.navigate(["/wordle"]);
	}

	onIframeLoad() {
		this.iframeLoaded = true;
		this.iframeError = false;
		// Iframe now takes full available height via CSS
	}

	onIframeError() {
		this.iframeLoaded = false;
		this.iframeError = true;
	}

	openWordleInNewTab() {
		window.open("http://localhost:4201", "_blank");
	}
}
