import { Environment } from './environment.interface';

const production: boolean = false;
const backendUrl: string = 'http://localhost:80';
export const environment: Environment = {
	production,
	backendUrl,
};
