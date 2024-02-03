import { Injectable } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor,
	HttpHeaders,
	HTTP_INTERCEPTORS,
	HttpResponse
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	constructor() { }

	intercept(
		request: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {
		request = request.clone({
			withCredentials: true,
		  });

		return next
			.handle(request);
	}
}

