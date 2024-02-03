import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamingMoviesComponent } from './streaming-movies.component';

describe('StreamingMoviesComponent', () => {
  let component: StreamingMoviesComponent;
  let fixture: ComponentFixture<StreamingMoviesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StreamingMoviesComponent]
    });
    fixture = TestBed.createComponent(StreamingMoviesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
