import {Response, ResponseOptions, HttpModule, Http} from '@angular/http';
import {inject, TestBed} from '@angular/core/testing';
import {MockBackend} from '@angular/http/testing';

import {HttpMock} from './http-mock';
import {HttpMockModule} from './http-mock.module';
import {HttpMockError} from './http-mock-error';


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

  it('should mock response', inject([HttpMock, Http], (mock: HttpMock, http: Http) => {
    const nextFn = jasmine.createSpy('next');
    const errorFn = jasmine.createSpy('error');
    const options = {
      status: 200,
      body: 'ok'
    };
    mock.match({url: 'http://testserver/api/'}).andRespond(new ResponseOptions(options));

    http.get('http://testserver/api/').subscribe(
      nextFn.and.callFake((response: Response) => {
        expect(response.status).toEqual(200);
        expect(response.url).toEqual('http://testserver/api/');
        expect(response.text()).toEqual('ok');
      }),
      errorFn
    );

    expect(nextFn).toHaveBeenCalled();
    expect(errorFn).not.toHaveBeenCalled();
  }));

  it('should mock error response', inject([HttpMock, Http], (mock: HttpMock, http: Http) => {
    const nextFn = jasmine.createSpy('next');
    const errorFn = jasmine.createSpy('error');
    const response = {
      status: 400,
      body: 'Bad request'
    };
    mock.match({url: 'http://testserver/api/'}).andRespond(new ResponseOptions(response));

    http.get('http://testserver/api/').subscribe(
      nextFn,
      errorFn.and.callFake((error: HttpMockError) => {
        expect(error.status).toEqual(400);
        expect(error.message).toEqual('Bad request');
      })
    );

    expect(nextFn).not.toHaveBeenCalled();
    expect(errorFn).toHaveBeenCalled();
  }));

});
