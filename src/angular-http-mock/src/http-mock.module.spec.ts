import {Response, ResponseOptions, HttpModule, Http} from '@angular/http';
import {inject, TestBed} from '@angular/core/testing';

import {HttpMock} from './http-mock';
import {HttpMockModule} from './http-mock.module';
import {MockBackend} from '@angular/http/testing';
import createSpy = jasmine.createSpy;


describe('HttpMockModule', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule, HttpMockModule]
    });
  });

  afterEach(inject([MockBackend], (backend: MockBackend) => backend.verifyNoPendingRequests()));

  it('should be instantiated', inject([HttpMock], (mock: HttpMock) => {
    expect(mock).toBeDefined();
  }));

  it('should mock GET request', (inject([HttpMock, Http], (mock: HttpMock, http: Http) => {
    const responseData: ResponseOptions = new ResponseOptions({
      status: 200,
      body: 'ok'
    });
    const nextFn = createSpy('next', (response: Response) => {
      expect(response.url).toEqual('http://testserver/api/');
      expect(response.status).toEqual(responseData.status);
      expect(response.text()).toEqual(responseData.body);
    });
    const errorFn = createSpy('error', (error: any) => {});
    mock.match({url: 'http://testserver/api/'}).andRespond(responseData);

    http.get('http://testserver/api/').subscribe(nextFn, errorFn);

    expect(nextFn).toHaveBeenCalled();
    expect(errorFn).not.toHaveBeenCalled();
  })));

});

