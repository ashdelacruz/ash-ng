import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamingTvComponent } from './streaming-tv.component';

describe('StreamingTvComponent', () => {
  let component: StreamingTvComponent;
  let fixture: ComponentFixture<StreamingTvComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StreamingTvComponent]
    });
    fixture = TestBed.createComponent(StreamingTvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
