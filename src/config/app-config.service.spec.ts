import { TestBed } from '@angular/core/testing';

import { AppConfigService } from './app-config.service';
import { RestService } from 'src/app/services/rest.service';
import { Configuration } from './configuration.interface';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';


describe('AppConfigService', () => {
  let service: AppConfigService;


let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AppConfigService
      ],
    });
    service = TestBed.inject(AppConfigService);

    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
