import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-streaming',
  templateUrl: './streaming.component.html',
  styleUrls: ['./streaming.component.scss']
})
export class StreamingComponent {

  constructor(
    private router: Router
  ) {

  }


	navigateToRoute(route: string,) {
    this.router.navigate([route]);
	}

}
