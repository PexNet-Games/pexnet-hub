import {
	ApplicationConfig,
	provideZoneChangeDetection,
	APP_INITIALIZER,
} from "@angular/core";
import { provideRouter } from "@angular/router";
import {
	provideHttpClient,
	withInterceptors,
	HttpInterceptorFn,
} from "@angular/common/http";
import { catchError, throwError } from "rxjs";
import { ThemeService } from "./services/theme.service";

import { routes } from "./app.routes";

// Functional interceptor for authentication
const authInterceptor: HttpInterceptorFn = (req, next) => {
	// Add credentials to API requests
	if (req.url.includes("/api/")) {
		const authReq = req.clone({
			setHeaders: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		});
		return next(authReq);
	}

	return next(req);
};

// Functional interceptor for error handling
const errorInterceptor: HttpInterceptorFn = (req, next) => {
	return next(req).pipe(
		catchError((error: any) => {
			if (error.status === 401) {
				console.warn("Unauthorized request detected");
			} else if (error.status === 0) {
				console.error("Network error - check if the API server is running");
			}

			return throwError(() => error);
		}),
	);
};

// Theme initialization function
function initializeTheme(): () => void {
	return () => {
		// This function is called before the app starts
		console.log("Initializing theme...");
	};
}

export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes),
		provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
		{
			provide: APP_INITIALIZER,
			useFactory: initializeTheme,
			multi: true,
			deps: [ThemeService],
		},
	],
};
