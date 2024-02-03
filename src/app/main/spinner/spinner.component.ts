import { Component, Input, OnInit } from '@angular/core';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
	selector: 'app-spinner',
	templateUrl: './spinner.component.html',
	styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {
	constructor(private spinnerServ: SpinnerService) {}

	@Input() spin: boolean = false;

	ngOnInit(): void {}
}
