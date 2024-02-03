import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotCredentialsComponent } from './forgot-credentials.component';

describe('ForgotCredentialsComponent', () => {
  let component: ForgotCredentialsComponent;
  let fixture: ComponentFixture<ForgotCredentialsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ForgotCredentialsComponent]
    });
    fixture = TestBed.createComponent(ForgotCredentialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
