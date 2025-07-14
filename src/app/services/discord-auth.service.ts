import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, firstValueFrom } from "rxjs";
import { environment } from "../../environments/environment";

export interface DiscordUser {
	id: string;
	userId: string;
	username: string;
	discriminator: string;
	email: string;
	avatar: string;
	voiceTime: number;
}

@Injectable({
	providedIn: "root",
})
export class DiscordAuthService {
	private userSubject = new BehaviorSubject<DiscordUser | null>(null);
	public user$ = this.userSubject.asObservable();

	private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
	public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

	private readonly API_BASE_URL = `${environment.apiUrl}/auth`;

	constructor(private http: HttpClient) {
		// Check authentication status on service initialization
		this.checkAuthStatus();
	}

	/**
	 * Initiate Discord OAuth2 login
	 */
	login(): void {
		window.location.href = `${this.API_BASE_URL}/discord`;
	}

	/**
	 * Logout the current user
	 */
	async logout(): Promise<void> {
		try {
			await firstValueFrom(this.http.post(`${this.API_BASE_URL}/logout`, {}));

			this.userSubject.next(null);
			this.isAuthenticatedSubject.next(false);
		} catch (error) {
			console.error("Logout failed:", error);
			throw error;
		}
	}

	/**
	 * Check current authentication status
	 */
	async checkAuthStatus(): Promise<void> {
		try {
			const data = await firstValueFrom(
				this.http.get<{ success: boolean; user?: DiscordUser }>(
					`${this.API_BASE_URL}/profile`,
				),
			);

			if (data.success && data.user) {
				this.userSubject.next(data.user);
				this.isAuthenticatedSubject.next(true);
			} else {
				this.userSubject.next(null);
				this.isAuthenticatedSubject.next(false);
			}
		} catch (error) {
			console.error("Auth status check failed:", error);
			this.userSubject.next(null);
			this.isAuthenticatedSubject.next(false);
		}
	}

	/**
	 * Get current user data
	 */
	getCurrentUser(): DiscordUser | null {
		return this.userSubject.value;
	}

	/**
	 * Get Discord avatar URL
	 */
	getAvatarUrl(user: DiscordUser): string {
		if (user.avatar) {
			// Check if avatar is already a full URL
			if (user.avatar.startsWith("https://")) {
				return user.avatar;
			}
			// If it's just a hash, construct the full URL
			return `https://cdn.discordapp.com/avatars/${user.userId}/${user.avatar}.png`;
		}
		// Default Discord avatar
		const defaultAvatar = parseInt(user.discriminator) % 5;
		return `https://cdn.discordapp.com/embed/avatars/${defaultAvatar}.png`;
	}
}
