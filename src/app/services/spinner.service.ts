import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class SpinnerService {
	private _isSpinning: boolean = false;
	constructor() {}
	spin(): void {
		this._isSpinning = true;
	}
	stop(): void {
		this._isSpinning = false;
	}

	get isSpinning() {
		return this._isSpinning;
	}
}
