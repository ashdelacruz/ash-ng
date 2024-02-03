import { Component, Renderer2 } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { hexToRgb, Color, Solver, rgbToHex } from 'src/app/interfaces/color';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-theme',
  templateUrl: './theme.component.html',
  styleUrls: ['./theme.component.scss']
})

//TODO: Finish implementing Theme component
export class ThemeComponent {



  isDarkMode: boolean;
  darkLogoPath: string;
  lightLogoPath: string;
  darkModeLogoPath: string;

  disabled = false;
  max = 255;
  min = 0;
  showTicks = false;
  step = 1;
  thumbLabel = false;
  value = 0;

  logoOptions: {name: string, lightPath: string, darkPath: string}[];



  primaryRed = 255;
  primaryGreen = 193;
  primaryBlue = 7;

  accentRed = 33;
  accentGreen = 33;
  accentBlue = 33;

  warnRed = 244;
  warnGreen = 67;
  warnBlue = 54;

  // primaryHex = "#12346";
  // accentHex = "";
  // warnHex = "";
  // primaryHex = rgbToHex(this.primaryRed, this.primaryGreen, this.primaryBlue);
  // accentHex = rgbToHex(this.accentRed, this.accentGreen, this.accentBlue);
  // warnHex = rgbToHex(this.warnRed, this.warnGreen, this.warnBlue);

  colorForm;

  constructor(
    private fb: FormBuilder,
    private themeService: ThemeService,
    private rendered: Renderer2
  ) {
    this.themeService.logoPathSub$.subscribe(path => {
      this.lightLogoPath = path;
    });

    this.colorForm = this.fb.group({
      primaryHex: [rgbToHex(this.primaryRed, this.primaryGreen, this.primaryBlue), [Validators.required]],
      accentHex: [rgbToHex(this.accentRed, this.accentGreen, this.accentBlue), [Validators.required]],
      warnHex: [rgbToHex(this.warnRed, this.warnGreen, this.warnBlue), [Validators.required]]
    });

    console.log("primaryHexForm= ", this.f.primaryHex.value);
    console.log("accentHexForm= ", this.f.accentHex.value);
    console.log("warnHexForm= ", this.f.warnHex.value);

    // this.logoOptions = [
    //   {
    //     name: 'Original',
    //     lightPath: this.themeService.logo_1_black,
    //     darkPath: this.themeService.logo_1_white,
    //   },
    //   {
    //     name: 'Fancy',
    //     lightPath: this.themeService.logo_2_black,
    //     darkPath: this.themeService.logo_2_white,
    //   },
    //   {
    //     name: 'Basic',
    //     lightPath: this.themeService.logo_3_black,
    //     darkPath: this.themeService.logo_3_white,
    //   }
    // ]


  }

  componentToHex(c: number) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  onPrimaryHexInput() {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.f.primaryHex.value!);

    console.log("onPrimaryHexInpout result= " , result);

    if(result) {
      this.primaryRed = parseInt(result[1], 16);
      this.primaryGreen = parseInt(result[2], 16);
      this.primaryBlue = parseInt(result[3], 16);
    }
  }

  onAccentHexInput() {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.f.accentHex.value!);

    console.log("onAccentHexInput result= " , result);

    if(result) {
      this.accentRed = parseInt(result[1], 16);
      this.accentGreen = parseInt(result[2], 16);
      this.accentBlue = parseInt(result[3], 16);
    }
  }

  onWarnHexInput() {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.f.warnHex.value!);

    console.log("onWarnHexInput result= " , result);

    if(result) {
      this.warnRed = parseInt(result[1], 16);
      this.warnGreen = parseInt(result[2], 16);
      this.warnBlue = parseInt(result[3], 16);
    }
  }

  onPrimarySliderChange() {
    console.log("onSliderchanged");
    this.f.primaryHex.setValue("#" + this.componentToHex(this.primaryRed) + this.componentToHex(this.primaryGreen) + this.componentToHex(this.primaryBlue));
  }

  onAccentSliderChange() {
    console.log("onSliderchanged");
    this.f.accentHex.setValue("#" + this.componentToHex(this.accentRed) + this.componentToHex(this.accentGreen) + this.componentToHex(this.accentBlue));
  }

  onWarnSliderChange() {
    console.log("onSliderchanged");
    this.f.warnHex.setValue("#" + this.componentToHex(this.warnRed) + this.componentToHex(this.warnGreen) + this.componentToHex(this.warnBlue));
  }

  get f() {
    return this.colorForm.controls;
  }

  rgbToHex(r: number, g: number, b:number) {
    this.rgbToHex(r, g, b);
  }

  //Original code courtesy of https://codepen.io/sosuke/pen/Pjoqqp 
  computeFilters() {

    const targetHEX: string = this.f.primaryHex.value!;
    console.log("targetHEX= ", targetHEX);

    const targetRGB = hexToRgb(targetHEX);
    console.log("targetRGB= ", targetRGB?.toString());

    const targetColor = new Color(targetRGB![0], targetRGB![1], targetRGB![2]);
    console.log("targetColor= ", targetColor?.toString());

    const solver = new Solver(targetColor);
    const filteredColor = solver.solve();

    console.log("filteredColor= ", filteredColor);

    let lossMsg;
    if (filteredColor.loss < 1) {
      lossMsg = 'This is a perfect result.';
    } else if (filteredColor.loss < 5) {
      lossMsg = 'The is close enough.';
    } else if (filteredColor.loss < 15) {
      lossMsg = 'The color is somewhat off. Consider running it again.';
    } else {
      lossMsg = 'The color is extremely off. Run it again!';
    }

    console.log("lossMsg= ", lossMsg);

    const realElements = document.getElementsByClassName('real');
    for (let i = 0; i < realElements.length; i++) {
      let element = realElements.item(i) as HTMLElement;
      element.style.backgroundColor = targetColor.toString();
    }
    console.log("realElement= ", realElements);

    const filterElements = document.getElementsByClassName('filtered');
    for (let i = 0; i < filterElements.length; i++) {
      let element = filterElements.item(i) as HTMLElement;
      element.setAttribute("style", filteredColor.filter!);
    }
    console.log("realElement= ", filterElements);

    const filterDetailElement = <HTMLElement>document.getElementsByClassName('filterDetail')[0];
    console.log("filterDetailElement= ", filterDetailElement);

    const lossDetailElement = <HTMLElement>document.getElementsByClassName('lossDetail')[0];
    console.log("lossDetailElement= ", lossDetailElement);

    // realElement.style.backgroundColor = targetColor.toString();
    // filterElement.setAttribute("style", filteredColor.filter!);
    filterDetailElement.textContent = filteredColor.filter!;
    lossDetailElement.innerHTML = `Loss: ${filteredColor.loss.toFixed(1)}. <b>${lossMsg}</b>`;




    // $('.logo-icon-real').css('background-color', color.toString());
    // $('.logo-icon-filtered').attr('style', result.filter);
    // $('.filterDetail').text(result.filter);
    // $('.lossDetail').html(`Loss: ${result.loss.toFixed(1)}. <b>${lossMsg}</b>`);


  }

  // hexToRGB(hex: string): Color {
  //   var r = parseInt(hex.slice(1, 3), 16),
  //     g = parseInt(hex.slice(3, 5), 16),
  //     b = parseInt(hex.slice(5, 7), 16);

  //   return new Color(r, g, b);
  // }
}
