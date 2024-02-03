import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { DomSanitizer } from '@angular/platform-browser';
import { combineLatest } from 'rxjs';
import { BookInfo } from 'src/app/interfaces/books';
import { ThemeService } from 'src/app/services/theme.service';
import { MobileService } from 'src/app/services/mobile.service';
import { AppConfigService } from 'src/config/app-config.service';
import { GalleryItem, ImageItem } from 'ng-gallery';


export interface iconLink {
  name: string,
  link: string
}

const IMAGE_COUNT = 6;

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})

export class AboutComponent {
  // @Output() afterExpand: EventEmitter<void>

  // @ViewChild(MatTooltip) downloadTooltip: MatTooltip;

  slides: string[] = [];
  skillsIcons: iconLink[];
  socialsIcons: iconLink[];
  skillsColorIcons: iconLink[];
  socialsColorIcons: iconLink[];
  pdfSrc: string;
  pdfFileName: string;
  isMobile: boolean;
  isPortrait: boolean;
  isDarkMode: boolean;
	logoPath: string;
	darkModeLogoPath: string;
  items: GalleryItem[] = [];

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private themeService: ThemeService,
    private mobileService: MobileService,
    private configService: AppConfigService
  ) {
    for (let i = 1; i < 6; i++) {
      this.slides.push("/assets/media/about/profile" + i + ".jpeg");
    }


    for(let i = 1; i < IMAGE_COUNT; i++) {
      this.items.push(new ImageItem({src: "/assets/media/about/profile" + i + ".jpeg", thumb:  "/assets/media/about/profile" + i + ".jpeg",}));
    }

    this.pdfFileName = 'AshDelaCruz_Resume.pdf';
    this.pdfSrc = '/assets/documents/';

		this.themeService.logoPathSub$.subscribe(path => {
			this.logoPath = path;
		});

    combineLatest([this.mobileService.isMobileSub$, this.mobileService.isPortraitSub$]).subscribe(result => {
			this.isMobile = result[0];
			this.isPortrait = result[1];
		});
    

    this.themeService.isDarkModeSub$.subscribe(isDarkMode => {
      this.isDarkMode = isDarkMode;
    })

    this.addSvgIcons();

  }

  addSvgIcons() {

    //Grayscale
    this.skillsIcons = [
      {
        name:'angular',
        link:'Angular; Typescript, HTML, CSS'
      },
      {
        name:'javamin',
        link:'Java'
      },
      {
        name:'spring',
        link:'SpringBoot'
      },
      {
        name:'cli',
        link:'Command Line Interface'
      },
      {
        name:'linux',
        link:'Linux'
      },
      {
        name:'sql',
        link:'SQL'
      },
      {
        name:'docker',
        link:'Docker'
      },
      // {
      //   name:'kubernetes',
      //   link:'Kubernetes'
      // },
      {
        name:'npm',
        link:'NPM'
      },
      {
        name:'capacitor',
        link:'Capacitor'
      },
      {
        name:'elasticsearch',
        link:'ElasticSearch'
      },
      {
        name:'nginx',
        link:'Nginx'
      },
      // {
      //   name:'git',
      //   link:'Git'
      // },
      {
        name:'rpi',
        link:'Raspberry Pi'
      }
    ];

    this.socialsIcons = [
      {
        name:'linkedin',
        link:'https://www.linkedin.com/in/ash-dela-cruz/'
      },
      {
        name:'github',
        link:'https://github.com/ashdelacruz'
      }
      // {
      //   name:'instagram',
      //   link:'https://www.instagram.com/trash_ketchum_/'
      // }
    ];

    this.skillsIcons.forEach(icon => {
      this.matIconRegistry.addSvgIcon(
        icon.name,
        this.domSanitizer.bypassSecurityTrustResourceUrl(
          '../assets/icons/gray/'+ icon.name +'.svg'
        )
      );
      this.matIconRegistry.addSvgIcon(
        icon.name + '-color',
        this.domSanitizer.bypassSecurityTrustResourceUrl(
          '../assets/icons/color/'+ icon.name + '-color' +'.svg'
        )
      );
    });

    this.socialsIcons.forEach(icon => {
      this.matIconRegistry.addSvgIcon(
        icon.name,
        this.domSanitizer.bypassSecurityTrustResourceUrl(
          '../assets/icons/gray/'+ icon.name +'.svg'
        )
      )
      this.matIconRegistry.addSvgIcon(
        icon.name + '-color',
        this.domSanitizer.bypassSecurityTrustResourceUrl(
          '../assets/icons/color/'+ icon.name + '-color' +'.svg'
        )
      )
    });

  }

  public downloadResume(): void {
    if (this.isMobile) {
      window.open(this.pdfSrc + this.pdfFileName, "_blank");
    } else {

      const link = document.createElement("a");
      link.href = this.pdfSrc;
      link.download = this.pdfFileName;
      link.click();
      link.remove();
    }

  }

  openInNewTab(link: string) {
    window.open(link, "_blank");
  }

  scrollIntoView(downloadTooltip: MatTooltip): void {

    let el = document.getElementById('about-resume');
    el?.scrollIntoView({ behavior: "smooth" });

    setTimeout(() => downloadTooltip.show(), 1000);
    
    
  }

  scrollToTop(): void {
    let el = document.getElementById('about-container');
    el?.scrollIntoView({ behavior: "smooth" });
  }

}
