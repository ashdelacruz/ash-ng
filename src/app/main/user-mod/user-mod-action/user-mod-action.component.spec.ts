import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserModActionComponent } from './user-mod-action.component';

describe('UserModActionFormComponent', () => {
  let component: UserModActionComponent;
  let fixture: ComponentFixture<UserModActionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserModActionComponent]
    });
    fixture = TestBed.createComponent(UserModActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
