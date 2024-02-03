import { Component } from '@angular/core';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-streaming-content',
  templateUrl: './streaming-content.component.html',
  styleUrls: ['./streaming-content.component.scss']
})
export class StreamingContentComponent {
  constructor(
    private rest: RestService
  ) {
    // this.getSampleVideo();
  }

  getSampleVideo() {
    this.rest.get('http://localhost:80/api/stream/sample', {}, {}, 'video/mp4').subscribe(resp => {
      console.log("TESTING STREAM RESP!!!", resp);
    })
  }
}
