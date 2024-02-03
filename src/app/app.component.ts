import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { noop } from 'lodash';
import { combineLatest } from 'rxjs';
import { EnvironmentService } from 'src/environments/environment.service';
import { MobileService } from './services/mobile.service';
import { SnackBarService } from './services/snack-bar.service';
import { SpinnerService } from './services/spinner.service';
import { Theme, ThemeService } from './services/theme.service';
import { UserAuthService } from './services/user-auth.service';
import { UserModService } from './services/user-mod.service';
import { UserSessionService } from './services/user-session.service';


@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

	//Navigation variables
	isNavbarOnTop: boolean = true;
	isSideNavOnLeft: boolean = true;
	topLeft: string = 'Top Left';
	topRight: string = 'Top Right';
	bottomLeft: string = 'Bottom Left';
	bottomRight: string = 'Bottom Right';
	activeNavPosition: string = this.topLeft;

	//Theme variables
	logoPath: string;
	darkModeOptions: string[];
	mode: string;
	@HostBinding('class') activeThemeClass: string;
	activeTheme: string;
	themeOptions: Theme[];

	//Other
	mobileQuery: MediaQueryList;
	private _mobileQueryListener: () => void;

	isMobile: boolean = false;
	isUserOniPhone: boolean = false; //To handle dynamic island on iphone landscape mode
	isLandscape: boolean = false;
	isHamburgerIconActive: boolean = false;

	isDemoMode: boolean = true;

	get mobileSpinning() {
		return this.spinnerService.isSpinning;
	}

	constructor(
		changeDetectorRef: ChangeDetectorRef,
		media: MediaMatcher,
		private spinnerService: SpinnerService,
		private mobileService: MobileService,
		private router: Router,
		public dialog: MatDialog,
		private themeService: ThemeService,
		private snackbarService: SnackBarService,
		public userSessionService: UserSessionService,
		private userAuthService: UserAuthService,
		public userModService: UserModService,
		private environmentService: EnvironmentService
	) {



		this.mobileQuery = media.matchMedia('(max-width: 600px)');
		this._mobileQueryListener = () => changeDetectorRef.detectChanges();
		this.mobileQuery.addListener(this._mobileQueryListener);


		this.isDemoMode = this.userModService.isDemoMode;

	}

	/**
	 * Handlese theme/logo setup, and screen orientation 
	 */
	ngOnInit(): void {

		this.themeService.logoPathSub$.subscribe(path => {
			this.logoPath = path;
		});

		this.darkModeOptions = this.themeService.darkModeOptions;
		this.mode = this.themeService.mode;
		this.themeOptions = this.themeService.themeOptions;
		this.activeTheme = this.themeService.activeTheme;
		this.activeThemeClass = this.themeService.activeThemeClass;

		combineLatest([this.mobileService.isMobileSub$, this.mobileService.isLandscapeSub$]).subscribe(result => {
			this.isMobile = result[0];
			this.isLandscape = result[1];
		});

		this.isUserOniPhone = this.mobileService.isUserOniPhoneSub$;

	}

	logout(): void {
		this.spinnerService.spin();
		this.userAuthService.logout().subscribe({
			next: resp => {
				this.spinnerService.stop();

				this.userSessionService.clean();
				this.snackbarService.showInfoSnackbar("Logout Successful");
				this.router.navigate(["/home"]);
				// this.dataSource.data = LOGGED_OUT_NAV_TREE;
				this.userModService.isDemoMode = true;
				// location.reload();
			},
			error: err => {
				this.spinnerService.stop();
				this.snackbarService.showErrorSnackbar("Logout Error");
				console.error(err);
			}
		})
	}

	/**
	 * Used for testing API authorities during development
	 */
	test(): void {
		console.log("TEST!!! isUserAuth? " + this.userSessionService.isAuthenticated());
		this.userSessionService.getModeratorBoard().subscribe({
			next: resp => {
				this.snackbarService.showInfoSnackbar(JSON.stringify(resp));
				console.log("TEST!!! resp = " + JSON.stringify(resp));
			},
			error: err => {
				this.snackbarService.showErrorSnackbar(JSON.stringify(err));
				console.log("TEST!!! err = " + JSON.stringify(err));
			}
		});
	}

	ngOnDestroy(): void {
		this.mobileQuery.removeListener(this._mobileQueryListener);
	}

	get spinnerStatus() {
		return this.spinnerService.isSpinning;
	}

	//Navigation functions
	setMenuPosition(top: number, left: number) {
		console.log("LOGIN backend = " + this.environmentService.backendUrl);

		this.isNavbarOnTop = top ? true : false;
		this.isSideNavOnLeft = left ? true : false;

		this.activeNavPosition =
			this.isNavbarOnTop && this.isSideNavOnLeft ? this.topLeft :
				this.isNavbarOnTop && !this.isSideNavOnLeft ? this.topRight :
					!this.isNavbarOnTop && this.isSideNavOnLeft ? this.bottomLeft : this.bottomRight;
	}


	navigateToRoute(route: string) {
		if (route !== 'NONE') {
			this.spinnerService.isSpinning ? this.spinnerService.stop() : noop();
			this.isHamburgerIconActive = false;

			this.router.navigate([route]);

		}
	}

	//Theme functions
	/**
	 * 
	 * @param theme midnight-cheese, incredible-hulk, giving-thanks, baby-blue, or any of their -dark variants
	 */
	setCurrentTheme(theme: Theme) {
		this.themeService.logoPath = theme.logo;
		this.themeService.darkLogoPath = theme.darkLogo;
		this.themeService.toggleLogoPath();

		this.themeService.setCurrentTheme(theme.name);

		this.activeTheme = this.themeService.activeTheme;
		this.activeThemeClass = this.themeService.activeThemeClass;

	}

	/**
	 * 
	 * @param mode light, dark, or system
	 */
	setMode(mode: string) {
		this.themeService.setMode(mode);
		this.themeService.toggleLogoPath();

		this.activeTheme = this.themeService.activeTheme;
		this.activeThemeClass = this.themeService.activeThemeClass;
	}

}
