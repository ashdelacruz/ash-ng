import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class MobileService {
	private isMobileSub: Subject<boolean>  = new BehaviorSubject<boolean>(false);
	private isPortraitSub: Subject<boolean> = new BehaviorSubject<boolean>(false);
	private isLandscapeSub: Subject<boolean> = new BehaviorSubject<boolean>(true);
	private isUserOniPhoneSub: boolean = false;
	

	constructor(
		private breakpointObserver: BreakpointObserver
	) {
		let userAgentString = window.navigator.userAgent;

		this.isUserOniPhoneSub = userAgentString.includes('iPhone');

		this.breakpointObserver.observe([
			Breakpoints.HandsetPortrait,
			Breakpoints.HandsetLandscape,
			Breakpoints.TabletPortrait,
			Breakpoints.TabletLandscape,
			Breakpoints.Web])
			.subscribe(result => {
	  
			  const breakpoints = result.breakpoints;
	  
			  if (breakpoints[Breakpoints.HandsetPortrait] || breakpoints[Breakpoints.TabletPortrait]) {
			
				this.isMobileSub.next(true);
				this.isPortraitSub.next(true);
				this.isLandscapeSub.next(false);
			  }
			  else if (breakpoints[Breakpoints.HandsetLandscape] || breakpoints[Breakpoints.TabletLandscape]) {
	
				this.isMobileSub.next(true);
				this.isPortraitSub.next(false);
				this.isLandscapeSub.next(true);
			  } else if(breakpoints[Breakpoints.Web]) {
				this.isMobileSub.next(false);
			  }
			});
	}

	get isMobileSub$() {
		return this.isMobileSub.asObservable();
	}

	get isPortraitSub$() {
		return this.isPortraitSub.asObservable();
	}

	get isLandscapeSub$() {
		return this.isLandscapeSub.asObservable();
	}

	get isUserOniPhoneSub$() {
		return this.isUserOniPhoneSub;
	}

}
