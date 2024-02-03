import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, of } from 'rxjs';
// import { EnvironmentService } from 'src/environments/environment.service';
import { Configuration } from './configuration.interface';
import { EnvironmentService } from 'src/environments/environment.service';

@Injectable({
	providedIn: 'root'
})
export class AppConfigService {
	private _config!: Configuration;
	private _loaded: boolean = false;
	private _configPath = '/src/config/config.json';
	

	constructor(
	private http: HttpClient,
		private environment: EnvironmentService
	) {
		this._config = {
			"environment": "development",
			"apiUrls": {
				"gutenbergUrl": "https://gutendex.com",
				"jokeApiUrl": "https://v2.jokeapi.dev",
				"imgFlipUrl": "https://api.imgflip.com",
			},
			"sessionKeys": {
				"userSessionDataKey": "auth-user",
				"userAuthorityLevelKey": "authority-level",
				"browseBooksKey": "browseListOfBooks",
				"searchBooksKey": "searchListOfBooks",
				"booksTopicsKey": "booksTopicOptions"
			},
			"credentials": {
				"imgFlipCreds": {
					"uname": "EarlDelaCruz",
					"pass": "hewgov-hajva3-cozwaD"
				}
			}
		};
	}

	public loadConfig(): Observable<Configuration> {
		// let configPath = 'src/config/config.json';
		// let env = window['ash_env'];


		// @ts-ignore
		window['mobile'] = 'true'; // Uncomment to enable/disable mobile view on local desktop
		
		return of(this._config);

		// return this.http.get<Configuration>(this._configPath);
	}

	public get config(): Configuration {
		return this._config;
	}

	public get isLoaded(): boolean {
		return this._loaded;
	}
}
