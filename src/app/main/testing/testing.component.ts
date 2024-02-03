import { Component, Renderer2 } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { usernameValidatorPattern } from 'src/app/common/utils';
import { Color, Solver, hexToRgb } from 'src/app/interfaces/color';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.scss']
})
export class TestingComponent {

}
