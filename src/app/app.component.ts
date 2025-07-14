import { CommonModule } from "@angular/common";
import { Component, ElementRef, ViewChild, OnInit } from "@angular/core";
import { Router, RouterOutlet, NavigationEnd } from "@angular/router";
import { filter } from "rxjs/operators";
import { HeaderComponent } from "./header/header.component";

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

	constructor(private router: Router) {}

	ngOnInit() {
		// Listen to route changes
		this.router.events
			.pipe(filter((event) => event instanceof NavigationEnd))
			.subscribe((event: NavigationEnd) => {
				this.currentRoute = event.url;
				this.showWordle = event.url === "/wordle";

				if (this.showWordle) {
					// Reset iframe state when showing Wordle
					this.iframeLoaded = false;
					this.iframeError = false;
				}
			});

		// Set initial route based on current URL
		this.currentRoute = this.router.url;
		this.showWordle = this.router.url === "/wordle";
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
