import { Component } from '@angular/core';
import { combineLatest } from 'rxjs';
import { MobileService } from 'src/app/services/mobile.service';
import { ThemeService } from 'src/app/services/theme.service';
import { UserSessionService } from 'src/app/services/user-session.service';
import { AppConfigService } from 'src/config/app-config.service';
import { CardComponent } from '../shared-components/card/card.component';
export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
  card?: CardComponent;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {



  isMobile: boolean;
  isPortrait: boolean;
  isDarkMode: boolean;
	logoPath: string;
  
  constructor(
    private themeService: ThemeService,
    private mobileService: MobileService,
    private configService: AppConfigService,
    public userSessionService: UserSessionService
  ) {


    this.themeService.logoPathSub$.subscribe(path => {
			this.logoPath = path;
		});

    combineLatest([this.mobileService.isMobileSub$, this.mobileService.isPortraitSub$]).subscribe(result => {
			this.isMobile = result[0];
			this.isPortrait = result[1];
		});
 
  }

}
