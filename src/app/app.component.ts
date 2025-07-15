import {
	Component,
	ChangeDetectionStrategy,
	signal,
	inject,
} from "@angular/core";
import { Router, RouterOutlet, NavigationEnd } from "@angular/router";
import { filter } from "rxjs/operators";
import { HeaderComponent } from "./header/header.component";
import { DiscordAuthService } from "./services/discord-auth.service";

@Component({
	selector: "app-root",
	imports: [RouterOutlet, HeaderComponent],
	templateUrl: "./app.component.html",
	styleUrl: "./app.component.scss",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
	title = "pexnet-hub";
	currentRoute = signal<string>("/home");

	private router = inject(Router);
	private discordAuthService = inject(DiscordAuthService);

	constructor() {
		// Listen to route changes
		this.router.events
			.pipe(filter((event) => event instanceof NavigationEnd))
			.subscribe((event: NavigationEnd) => {
				this.currentRoute.set(event.url);
			});

		// Set initial route based on current URL
		this.currentRoute.set(this.router.url);

		// Initialize Discord authentication check
		this.discordAuthService.checkAuthStatus();
	}

	navigateToHome(): void {
		this.router.navigate(["/home"]);
	}

	navigateToWordle(): void {
		this.router.navigate(["/wordle"]);
	}
}
