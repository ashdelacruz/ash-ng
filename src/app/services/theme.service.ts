import { HostBinding, Injectable } from '@angular/core';
import { BehaviorSubject, Subject, noop } from 'rxjs';

//Themes
export enum themeEnums {
  MIDNIGHT_CHEESE = 'midnight-cheese',
  INCREDIBLE_HULK = 'incredible-hulk',
  GIVING_THANKS = 'giving-thanks',
  BABY_BLUE = 'baby-blue'
}

export interface Theme {
  label: string,
  name: string,
  logo: string
  darkLogo: string
  abbrev: string
}
const THEME_DARKNESS_SUFFIX = `-dark`;

@Injectable({
  providedIn: 'root'
})

export class ThemeService {

  private logo_1yb = '/assets/icons/color/adc_logo_1yb.png';
  private logo_1by = '/assets/icons/color/adc_logo_1by.png';

  private logo_2gp = '/assets/icons/color/adc_logo_2gp.png';
  private logo_2pg = '/assets/icons/color/adc_logo_2pg.png';

  private logo_3gb = '/assets/icons/color/adc_logo_3gb.png';
  private logo_3bg = '/assets/icons/color/adc_logo_3bg.png';

  private logo_4ob = '/assets/icons/color/adc_logo_4ob.png';
  private logo_4bo = '/assets/icons/color/adc_logo_4bo.png';


  //Themes variables
  themeOptions: Theme[];
  @HostBinding('class') activeThemeClass: string;
  isDarkMode: boolean;
  activeTheme: string;

  darkModeOptions: string[];
  mode: string;

  private _isDarkModeSub: Subject<boolean>;
  private _logoPathSub: Subject<string>;

  public logoPath = "";
  public darkLogoPath = "";


  constructor() {

    //Detect system Dark Mode by default
    this._isDarkModeSub = new BehaviorSubject<boolean>(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

    this.logoPath = this.logo_1by;
    this.darkLogoPath = this.logo_1yb;

    this._logoPathSub = new BehaviorSubject<string>(this.darkLogoPath);

    this.darkModeOptions = ['light', 'dark', 'system'];
    this.mode = this.darkModeOptions[2];
    this.isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    this.isDarkMode ? document.body.classList.add('dark-theme') : noop();
    this.themeOptions = [
      {
        label: "Midnight Cheese",
        name: themeEnums.MIDNIGHT_CHEESE,
        logo: this.logo_1by,
        darkLogo: this.logo_1yb,
        abbrev: "mc"
      },
      {
        label: "Incredible Hulk",
        name: themeEnums.INCREDIBLE_HULK,
        logo: this.logo_2pg,
        darkLogo: this.logo_2gp,
        abbrev: "ih"
      },
      {
        label: "Giving Thanks",
        name: themeEnums.GIVING_THANKS,
        logo: this.logo_4bo,
        darkLogo: this.logo_4ob,
        abbrev: "gt"
      },
      {
        label: "Baby Blue",
        name: themeEnums.BABY_BLUE,
        logo: this.logo_3gb,
        darkLogo: this.logo_3bg,
        abbrev: "bb"
      }
    ];
    this.activeTheme = themeEnums.MIDNIGHT_CHEESE;
    this.activeThemeClass = this.activeTheme;

    this.setCurrentTheme(this.activeTheme);


  }

  /**
   * 
   * @param theme midnight-cheese, incredible-hulk, giving-thanks, baby-blue, or any of their -dark variants
   */
  setCurrentTheme(theme: string) {
    this.activeTheme = theme;

    const cssClass = this.isDarkMode ? theme + THEME_DARKNESS_SUFFIX : theme;
    const classList = document.body.classList;

  
    classList.contains(this.activeThemeClass) ? classList.replace(this.activeThemeClass, cssClass) : classList.add(cssClass);
    this.activeThemeClass = cssClass;

  }

  /**
 * 
 * @param mode light, dark, or system
 */
  setMode(mode: string) {

    if (mode === 'light') {
      this.setLightMode();
    } else if (mode === 'dark') {
      this.setDarkMode();
    } else if (mode === 'system') {
      this.setSystemMode();
    }


    this.isDarkMode ? document.body.classList.add('dark-theme') : document.body.classList.remove('dark-theme');
    this.setCurrentTheme(this.activeTheme);
  }

  get isDarkModeSub$() {
    return this._isDarkModeSub.asObservable();
  }

  setIsDarkModeSub(param: boolean) {
    this.isDarkMode = param;
    this._isDarkModeSub.next(param);
  }

  setDarkMode() {
    this.isDarkMode = true;
    this._isDarkModeSub.next(true);
  }

  setLightMode() {
    this.isDarkMode = false;
    this._isDarkModeSub.next(false);
  }

  setSystemMode() {
    this.isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    this._isDarkModeSub.next(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  }

  get logoPathSub$() {
    return this._logoPathSub.asObservable();
  }

  setLogoPathSub(path: string) {
    this._logoPathSub.next(path);
  }

  toggleLogoPath() {
    this.setLogoPathSub(this.isDarkMode ? this.darkLogoPath : this.logoPath);
  }

}


