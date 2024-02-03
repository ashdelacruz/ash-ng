import { Injectable } from '@angular/core';
import { Environment } from './environment.interface';
import { environment } from '../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class EnvironmentService implements Environment {
	/* istanbul ignore next */
	get production(): boolean {
		return environment.production;
	}

	/* istanbul ignore next */
	get backendUrl(): string {
		return environment.backendUrl;
	}

}
