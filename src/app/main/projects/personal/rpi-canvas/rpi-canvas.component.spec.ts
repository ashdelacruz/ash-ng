import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RpiCanvasComponent } from './rpi-canvas.component';

describe('RpiCanvasComponent', () => {
  let component: RpiCanvasComponent;
  let fixture: ComponentFixture<RpiCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RpiCanvasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RpiCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
