import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";

export interface WordleUserData {
	discordId: string;
	username: string;
	avatar: string;
}

@Injectable({
	providedIn: "root",
})
export class WordleIntegrationService {
	private readonly WORDLE_GAME_URL = environment.wordleGameUrl;

	/**
	 * Send user data to Wordle iframe
	 */
	sendUserDataToWordle(targetWindow: Window, userData: WordleUserData | null) {
		const message = {
			type: "USER_DATA",
			discordId: userData?.discordId || null,
			username: userData?.username || null,
			avatar: userData?.avatar || null,
		};

		targetWindow.postMessage(message, this.WORDLE_GAME_URL);
	}

	/**
	 * Setup message listener for basic communication
	 */
	setupMessageListener(onMessage: (event: MessageEvent) => void) {
		const messageListener = (event: MessageEvent) => {
			// Security check - validate origin
			if (event.origin !== this.WORDLE_GAME_URL) return;
			onMessage(event);
		};

		window.addEventListener("message", messageListener);
		return messageListener;
	}

	/**
	 * Clean up message listener
	 */
	removeMessageListener(listener: (event: MessageEvent) => void) {
		window.removeEventListener("message", listener);
	}
}
