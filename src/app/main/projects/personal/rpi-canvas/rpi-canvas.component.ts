import { Component, OnInit } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';
import { combineLatest } from 'rxjs';
import { MobileService } from 'src/app/services/mobile.service';

@Component({
  selector: 'app-rpi-canvas',
  templateUrl: './rpi-canvas.component.html',
  styleUrls: ['./rpi-canvas.component.scss']
})
export class RpiCanvasComponent {

  isMobile:boolean;
  isPortrait:boolean;

  constructor(
    private mobileService: MobileService
  ) {

    combineLatest([
      this.mobileService.isMobileSub$,
      this.mobileService.isPortraitSub$
    ]).subscribe(result => {
      this.isMobile = result[0];
      this.isPortrait = result[1];
    });

  }

  downloadProjectGuide() {
    let fileName = 'RPI-display_album_covers_on_led_matrix.md';
    let mdSrc = '/assets/documents/RPI-display_album_covers_on_led_matrix.md';

    const link = document.createElement("a");
    link.href = mdSrc;
    link.download = fileName;
    link.click();
    link.remove();
  }

  readProjectGuide() {
    let mdSrc = '/assets/documents/RPI-display_album_covers_on_led_matrix.md';
   
    window.open(mdSrc, "_blank");
  }
}
  

