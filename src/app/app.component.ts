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
	currentRoute = "/home";

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
			});

		// Set initial route based on current URL
		this.currentRoute = this.router.url;

		// Initialize Discord authentication check
		this.discordAuthService.checkAuthStatus();
	}

	navigateToHome() {
		this.router.navigate(["/home"]);
	}

	navigateToWordle() {
		this.router.navigate(["/wordle"]);
	}
}
