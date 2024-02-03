import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DialogInterface, DialogType } from 'src/app/interfaces/dialog';
import { AuthorityTypes } from 'src/app/interfaces/user-session';
import { Theme, ThemeService } from 'src/app/services/theme.service';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { UserModActions, UserModService } from 'src/app/services/user-mod.service';
import { UserSessionService } from 'src/app/services/user-session.service';
import { DialogComponent } from '../shared-components/dialog/dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit{

  roleLabel = "";
  usernameLabel = "";
  emailLabel = "";

	darkModeOptions: string[];
	mode: string;
	@HostBinding('class') activeThemeClass: string;
	activeTheme: string;
	themeOptions: Theme[];

  constructor(
    private userAuthService: UserAuthService,
    private userSessionService: UserSessionService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private themeService: ThemeService,
    private userModService: UserModService,
    private dialogRef: MatDialogRef<DialogComponent>,
    public dialog: MatDialog,
  ) {

    if (!this.userSessionService.isAuthenticated()) {
      this.router.navigate(['/about']);
    }

    this.roleLabel = this.userSessionService.getUser().roleString !== null ? this.userSessionService.getUser().roleString! : "";
    this.usernameLabel = this.userSessionService.getUser().username;
    this.emailLabel = this.userSessionService.getUser().email;

  }

  ngOnInit(): void {
    this.darkModeOptions = this.themeService.darkModeOptions;
		this.mode = this.themeService.mode;
		this.themeOptions = this.themeService.themeOptions;
		this.activeTheme = this.themeService.activeTheme;
		this.activeThemeClass = this.themeService.activeThemeClass;
  }


	//Theme functions
	setCurrentTheme(theme: Theme) {
		this.themeService.logoPath = theme.logo;
		this.themeService.darkLogoPath = theme.darkLogo;
		this.themeService.toggleLogoPath();

		this.themeService.setCurrentTheme(theme.name);

		this.activeTheme = this.themeService.activeTheme;
		this.activeThemeClass = this.themeService.activeThemeClass;

	}

	setMode(mode: string) {
		this.themeService.setMode(mode);
		this.themeService.toggleLogoPath();

		this.activeTheme = this.themeService.activeTheme;
		this.activeThemeClass = this.themeService.activeThemeClass;
	}

  updateUsername() {
    this.router.navigate(['/user-auth/update/username']);
  }
  

  updateEmail() {
    this.router.navigate(['/user-auth/update/email']);
  }

  updatePassword() {
    this.router.navigate(['/user-auth/update/password']);
    
  }

  deleteAccount() {
    const dialogInterface: DialogInterface = {
      dialogTitle: "Delete Account",
      dialogText: [
        {
          header: "Are you sure?",
          body: "This will permanently remove all your information from AshDelaCruz.com"
        }
      ],
      cancelButtonLabel: "No",
      primaryButtonLabel: "Yes",
      dialogType: DialogType.BASIC,
      callbackMethod: () => {
        this.dialogRef.close();
        this.router.navigate(['/user-auth/delete']);
      },
    };
    this.dialogRef = this.dialog.open(DialogComponent, {
      data: dialogInterface,
    });
  }
}
