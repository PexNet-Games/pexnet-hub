import { Routes } from "@angular/router";

export const routes: Routes = [
	{
		path: "",
		redirectTo: "/home",
		pathMatch: "full",
	},
	{
		path: "home",
		loadComponent: () =>
			import("./home/home.component").then((m) => m.HomeComponent),
	},
	{
		path: "wordle",
		loadComponent: () =>
			import("./wordle/wordle-page.component").then(
				(m) => m.WordlePageComponent,
			),
		// Component handles authentication internally
	},
	{
		path: "**",
		redirectTo: "/home",
	},
];
