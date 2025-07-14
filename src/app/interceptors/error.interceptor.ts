import { Injectable } from "@angular/core";
import {
	HttpInterceptor,
	HttpRequest,
	HttpHandler,
	HttpErrorResponse,
} from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
	intercept(req: HttpRequest<any>, next: HttpHandler) {
		return next.handle(req).pipe(
			catchError((error: HttpErrorResponse) => {
				if (error.status === 401) {
					// Unauthorized - redirect to login or handle as needed
					console.warn("Unauthorized request detected");
				} else if (error.status === 0) {
					// Network error
					console.error("Network error - check if the API server is running");
				}

				return throwError(() => error);
			}),
		);
	}
}
