import { Injectable } from "@angular/core";
import {
	HttpInterceptor,
	HttpRequest,
	HttpHandler,
} from "@angular/common/http";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	intercept(req: HttpRequest<any>, next: HttpHandler) {
		// Add credentials to API requests
		if (req.url.includes("/api/")) {
			const authReq = req.clone({
				setHeaders: {
					"Content-Type": "application/json",
				},
				withCredentials: true,
			});
			return next.handle(authReq);
		}

		return next.handle(req);
	}
}
