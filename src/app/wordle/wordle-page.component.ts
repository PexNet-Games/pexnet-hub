import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { HeaderComponent } from "../header/header.component";

@Component({
	selector: "app-wordle-page",
	imports: [CommonModule, RouterModule, HeaderComponent],
	templateUrl: "./wordle-page.component.html",
})
export class WordlePageComponent implements OnInit {
	isLoading = true;
	showWordle = false;
	currentRoute = "/wordle";

	ngOnInit() {
		// Start loading the game immediately when the component initializes
		this.showWordle = true;
	}

	onIframeLoad() {
		this.isLoading = false;
	}
}
