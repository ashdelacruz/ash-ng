import { Component, OnInit } from '@angular/core';
import { Gallery, GalleryItem, ImageItem, ImageSize, ThumbnailsPosition } from 'ng-gallery';
import { Lightbox } from 'ng-gallery/lightbox';
import { combineLatest } from 'rxjs';
import { MobileService } from 'src/app/services/mobile.service';
import { ThemeService } from 'src/app/services/theme.service';
import { AppConfigService } from 'src/config/app-config.service';

const data = [
  {
    srcUrl:  "/assets/media/cat/kenickie1.jpg",
    previewUrl:  "/assets/media/cat/kenickie1.jpg",
  },
  {
    srcUrl:  "/assets/media/cat/kenickie1.jpg",
    previewUrl:  "/assets/media/cat/kenickie1.jpg",
  },
  {
    srcUrl:  "/assets/media/cat/kenickie2.jpg",
    previewUrl:  "/assets/media/cat/kenickie2.jpg",
  },
  {
    srcUrl:  "/assets/media/cat/kenickie3.jpg",
    previewUrl:  "/assets/media/cat/kenickie3.jpg",
  },
  {
    srcUrl:  "/assets/media/cat/kenickie4.jpg",
    previewUrl:  "/assets/media/cat/kenickie4.jpg",
  },
];
const IMAGE_COUNT = 12;
@Component({
  selector: 'app-cat',
  templateUrl: './cat.component.html',
  styleUrls: ['./cat.component.scss']
})
export class CatComponent implements OnInit {

  isMobile: boolean;
  isPortrait: boolean;
  isDarkMode: boolean;
	logoPath: string;
  
  items: GalleryItem[] = [];
  imageData = data;

  

  constructor(
    public gallery: Gallery, 
    public lightbox: Lightbox,    
    private themeService: ThemeService,
    private mobileService: MobileService,
    private configService: AppConfigService
  ) {


    this.themeService.logoPathSub$.subscribe(path => {
			this.logoPath = path;
		});

    combineLatest([this.mobileService.isMobileSub$, this.mobileService.isPortraitSub$]).subscribe(result => {
			this.isMobile = result[0];
			this.isPortrait = result[1];
		});

  }
  ngOnInit() {


    for(let i = 1; i <= IMAGE_COUNT; i++) {
      this.items.push(new ImageItem({src: "/assets/media/cat/kenickie" + i + ".jpg", thumb:  "/assets/icons/cat/kenickie" + i + ".jpg",}));
    }

    // Get a lightbox gallery ref
    const lightboxRef = this.gallery.ref('lightbox');

    // Add custom gallery config to the lightbox (optional)
    lightboxRef.setConfig({
      imageSize: ImageSize.Contain,
      autoHeight: true,
      thumbPosition: ThumbnailsPosition.Top
    });

    // Load items into the lightbox gallery ref
    lightboxRef.load(this.items);
  }
}
