import { Component, ChangeDetectionStrategy, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ThemeService } from "../services/theme.service";

@Component({
	selector: "app-theme-toggle",
	standalone: true,
	imports: [CommonModule],
	template: `
		<button
			(click)="toggleTheme()"
			class=" cursor-pointer rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 focus:outline-none"
			[title]="getTooltip()"
			aria-label="Changer le thème"
		>
			<span class="text-lg">{{ themeService.getThemeIcon() }}</span>
		</button>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggleComponent {
	public themeService = inject(ThemeService);

	toggleTheme(): void {
		this.themeService.toggleTheme();
	}

	getTooltip(): string {
		const theme = this.themeService.currentTheme();
		const next =
			theme === "light" ? "dark" : theme === "dark" ? "auto" : "light";
		return `Actuel: ${this.themeService.getThemeLabel(theme)} - Cliquer pour: ${this.themeService.getThemeLabel(next)}`;
	}
}
