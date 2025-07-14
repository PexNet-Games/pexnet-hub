import {
	Component,
	Input,
	OnInit,
	OnDestroy,
	HostListener,
	ElementRef,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import {
	DiscordAuthService,
	DiscordUser,
} from "../services/discord-auth.service";
import { Subscription } from "rxjs";

@Component({
	selector: "app-header",
	imports: [RouterModule, CommonModule],
	templateUrl: "./header.component.html",
})
export class HeaderComponent implements OnInit, OnDestroy {
	@Input() currentRoute = "";

	currentUser: DiscordUser | null = null;
	isAuthenticated = false;
	showUserMenu = false;
	private subscriptions: Subscription[] = [];

	constructor(
		private discordAuthService: DiscordAuthService,
		private elementRef: ElementRef,
	) {}

	ngOnInit(): void {
		// Subscribe to authentication status
		this.subscriptions.push(
			this.discordAuthService.isAuthenticated$.subscribe((isAuth) => {
				this.isAuthenticated = isAuth;
			}),
		);

		// Subscribe to user data
		this.subscriptions.push(
			this.discordAuthService.user$.subscribe((user) => {
				this.currentUser = user;
			}),
		);
	}

	ngOnDestroy(): void {
		this.subscriptions.forEach((sub) => sub.unsubscribe());
	}

	onDiscordLogin(): void {
		this.discordAuthService.login();
	}

	onLogout(): void {
		this.discordAuthService.logout();
		this.showUserMenu = false;
	}

	toggleUserMenu(): void {
		this.showUserMenu = !this.showUserMenu;
	}

	// Prevent click event from propagating when clicking on user menu button
	onUserMenuClick(event: Event): void {
		event.stopPropagation();
		this.toggleUserMenu();
	}

	getAvatarUrl(): string {
		if (this.currentUser) {
			return this.discordAuthService.getAvatarUrl(this.currentUser);
		}
		return "";
	}

	// Close user menu when clicking outside
	@HostListener("document:click", ["$event"])
	onDocumentClick(event: Event): void {
		const target = event.target as HTMLElement;
		if (!this.elementRef.nativeElement.contains(target)) {
			this.showUserMenu = false;
		}
	}
}
