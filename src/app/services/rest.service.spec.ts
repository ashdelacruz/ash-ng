import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { HttpHeaders, HttpParams } from '@angular/common/http';
import { HttpOptions, HttpParameters, RestService } from './rest.service';

describe('RestService', () => {
  let service: RestService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RestService],
    });
    service = TestBed.inject(RestService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createOptions', () => {
    it('should create HttpOptions with headers and params', () => {
      const overrideHeaders: HttpParameters = { 'Custom-Header': 'value' };
      const queryParams: HttpParameters = { param1: 'value1' };

      const result: HttpOptions = service.createOptions(
        overrideHeaders,
        queryParams
      );

      const expectedOptions: HttpOptions = {
        params: service.getParams(queryParams),
        headers: service.getHeaders(overrideHeaders),
      };

      expect(result).toEqual(expectedOptions);
    });
  });

  describe('get', () => {
    it('should make GET request with default options', () => {
      const url = 'https://example.com';

      service.get(url).subscribe();

      const req = httpTestingController.expectOne(url);
      expect(req.request.method).toEqual('GET');
    });

    // Add more test cases for get method based on your requirements
  });

  describe('post', () => {
    it('should make POST request with default options', () => {
      const url = 'https://example.com';
      const body = { key: 'value' };

      service.post(url, body).subscribe();

      const req = httpTestingController.expectOne(url);
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(body);
    });

    // Add more test cases for post method based on your requirements
  });

  // Add similar describe blocks for put, patch, delete methods

  describe('getHeaders', () => {
    it('should return HttpHeaders with default and extra headers', () => {
      const extraHeaders: HttpParameters = { 'Custom-Header': 'value' };

      const result: HttpHeaders = service.getHeaders(extraHeaders);

      const expectedHeaders: HttpHeaders = new HttpHeaders({
        ...service.defaultHeaders,
        ...extraHeaders,
      });

      expect(result).toEqual(expectedHeaders);
    });
  });

  describe('getParams', () => {
    it('should return HttpParams from given parameters', () => {
      const params: HttpParameters = { param1: 'value1', param2: 'value2' };

      const result: HttpParams = service.getParams(params);

      const expectedParams: HttpParams = new HttpParams({
        fromObject: params,
      });

      expect(result).toEqual(expectedParams);
    });
  });
});
