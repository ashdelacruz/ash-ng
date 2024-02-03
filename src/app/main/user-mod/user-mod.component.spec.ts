import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserModComponent } from './user-mod.component';

describe('UserModComponent', () => {
  let component: UserModComponent;
  let fixture: ComponentFixture<UserModComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserModComponent]
    });
    fixture = TestBed.createComponent(UserModComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
