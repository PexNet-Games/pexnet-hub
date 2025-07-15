import { Component, ChangeDetectionStrategy, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ThemeService } from "../services/theme.service";

@Component({
	selector: "app-theme-debug",
	standalone: true,
	imports: [CommonModule],
	template: `
		<div class="fixed bottom-4 right-4 z-50 p-4 bg-blue-500 text-white rounded-lg shadow-lg">
			<h4 class="font-bold mb-2">Theme Debug Info</h4>
			<p>Current Theme: {{ themeService.currentTheme() }}</p>
			<p>Applied Theme: {{ themeService.appliedTheme() }}</p>
			<button
				(click)="testToggle()"
				class="mt-2 px-2 py-1 bg-white text-blue-500 rounded text-sm"
			>
				Test Toggle
			</button>
			<button
				(click)="forceLight()"
				class="mt-2 ml-2 px-2 py-1 bg-yellow-400 text-black rounded text-sm"
			>
				Force Light
			</button>
			<button
				(click)="forceDark()"
				class="mt-2 ml-2 px-2 py-1 bg-gray-800 text-white rounded text-sm"
			>
				Force Dark
			</button>
		</div>
	`,
	// changeDetection: ChangeDetectionStrategy.OnPush, // Temporarily disabled for theme debugging
})
export class ThemeDebugComponent {
	public themeService = inject(ThemeService);

	testToggle(): void {
		console.log("Debug: Toggle clicked");
		this.themeService.toggleTheme();
	}

	forceLight(): void {
		console.log("Debug: Force light clicked");
		this.themeService.setTheme("light");
	}

	forceDark(): void {
		console.log("Debug: Force dark clicked");
		this.themeService.setTheme("dark");
	}
}
