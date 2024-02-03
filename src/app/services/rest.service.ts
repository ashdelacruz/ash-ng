import {
	HttpClient,
	HttpHeaders,
	HttpParams
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface HttpOptions {
	params?: HttpParams;
	headers: HttpHeaders;
}

export interface HttpParameters {
	[name: string]: string;
}

@Injectable({
	providedIn: 'root',
})
export class RestService {
	public defaultHeaders: HttpParameters;

	constructor(private http: HttpClient) {
		this.defaultHeaders = {};
	}

	createOptions(
		overrideHeaders: HttpParameters,
		queryParams: HttpParameters
		// respType?: HttpParams
	): HttpOptions {
		return {
			params: this.getParams(queryParams),
			headers: this.getHeaders(overrideHeaders),
		};
	}

	get(
		url: string,
		queryParams: HttpParameters = {},
		overrideHeaders: HttpParameters = {},
		responseType?: string
	): Observable<any> {
		const options: HttpOptions = this.createOptions(
			{
				...overrideHeaders,
			},
			queryParams
		);
		switch (responseType) {
			case 'text':
				return this.http.get(url, {
					...options,
					responseType: 'text' as const,
				});
			default:
				return this.http.get(url, { ...options });
		}
	}

	post(
		url: string,
		body?: object,
		overrideHeaders: HttpParameters = {},
		queryParams: HttpParameters = {},
		responseType?: string
	): Observable<any> {
		const options: HttpOptions = this.createOptions(
			{
				'Content-Type': 'application/x-www-form-urlencoded',
				...overrideHeaders,
			},
			queryParams
		);

		switch (responseType) {
			case 'text':
				return this.http.post(url, body, {
					...options,
					responseType: 'text' as const,
				});
			default:
				return this.http.post(url, body, { ...options });
		}
	}

	put(
		url: string,
		body: object | null,
		overrideHeaders: HttpParameters = {},
		queryParams: HttpParameters = {}
	): Observable<any> {
		const options: HttpOptions = this.createOptions(
			{
				'Content-Type': 'application/json',
				...overrideHeaders,
			},
			queryParams
		);

		return this.http.put(url, body, { ...options });
	}

	patch(
		url: string,
		body: object | null,
		overrideHeaders: HttpParameters = {},
		queryParams: HttpParameters = {}
	): Observable<any> {
		const options: HttpOptions = this.createOptions(
			{
				'Content-Type': 'application/json',
				...overrideHeaders,
			},
			queryParams
		);

		return this.http.patch(url, body, { ...options });
	}

	delete(
		url: string,
		body?: object,
		overrideHeaders: HttpParameters = {},
		queryParams: HttpParameters = {},
		responseType?: string
	): Observable<any> {
		// const options: HttpOptions = this.createOptions(
		// 	{
		// 		'Content-Type': 'application/json',
		// 		...overrideHeaders,
		// 	},
		// 	queryParams
		// );

		const options = {
			headers: new HttpHeaders({
			  'Content-Type': 'application/json',
			  ...overrideHeaders
			}),
			body: body,
		  };
		  

		return this.http.delete(url, { ...options }, );

		// switch (responseType) {
		// 	case 'text':
		// 		return this.http.post(url, body, {
		// 			...options,
		// 			responseType: 'text' as const,
		// 		});
		// 	default:
		// 		return this.http.post(url, body, { ...options });
		// }
	}

	getHeaders(extraHeaders: HttpParameters): HttpHeaders {
		return new HttpHeaders({ ...this.defaultHeaders, ...extraHeaders });
	}

	getParams(params: HttpParameters): HttpParams {
		return new HttpParams({ fromObject: params });
	}
}
