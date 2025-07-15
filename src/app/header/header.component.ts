import {
	Component,
	input,
	signal,
	computed,
	inject,
	effect,
	HostListener,
	ElementRef,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import {
	DiscordAuthService,
	DiscordUser,
} from "../services/discord-auth.service";
import { ThemeToggleComponent } from "../components/theme-toggle.component";

@Component({
	selector: "app-header",
	imports: [RouterModule, ThemeToggleComponent],
	templateUrl: "./header.component.html",
	//	changeDetection: ChangeDetectionStrategy.OnPush,// Temporarily disabled for theme debugging
})
export class HeaderComponent {
	currentRoute = input<string>("");

	currentUser = signal<DiscordUser | null>(null);
	isAuthenticated = signal<boolean>(false);
	showUserMenu = signal<boolean>(false);
	showMobileMenu = signal<boolean>(false);

	private discordAuthService = inject(DiscordAuthService);
	private elementRef = inject(ElementRef);

	avatarUrl = computed(() => {
		const user = this.currentUser();
		return user ? this.discordAuthService.getAvatarUrl(user) : "";
	});

	constructor() {
		// Subscribe to authentication status using effect
		effect(() => {
			const authSub = this.discordAuthService.isAuthenticated$.subscribe(
				(isAuth) => {
					this.isAuthenticated.set(isAuth);
				},
			);

			const userSub = this.discordAuthService.user$.subscribe((user) => {
				this.currentUser.set(user);
			});

			// Cleanup handled by effect automatically
			return () => {
				authSub.unsubscribe();
				userSub.unsubscribe();
			};
		});
	}

	onDiscordLogin(): void {
		this.discordAuthService.login();
	}

	onLogout(): void {
		this.discordAuthService.logout();
		this.showUserMenu.set(false);
	}

	toggleUserMenu(): void {
		this.showUserMenu.update((current) => !current);
	}

	toggleMobileMenu(): void {
		this.showMobileMenu.update((current) => !current);
	}

	closeMobileMenu(): void {
		this.showMobileMenu.set(false);
	}

	// Prevent click event from propagating when clicking on user menu button
	onUserMenuClick(event: Event): void {
		event.stopPropagation();
		this.toggleUserMenu();
	}

	getAvatarUrl(): string {
		const user = this.currentUser();
		return user ? this.discordAuthService.getAvatarUrl(user) : "";
	}

	// Close user menu when clicking outside
	@HostListener("document:click", ["$event"])
	onDocumentClick(event: Event): void {
		const target = event.target as HTMLElement;
		if (!this.elementRef.nativeElement.contains(target)) {
			this.showUserMenu.set(false);
			this.showMobileMenu.set(false);
		}
	}
}
