import {Response, HttpModule, Http} from '@angular/http';
import {inject, TestBed} from '@angular/core/testing';
import {MockBackend} from '@angular/http/testing';

import {HttpMock} from './http-mock';
import {HttpMockModule} from './http-mock.module';
import {HttpMockError} from './http-mock-error';


describe('HttpMockModule', () => {
  let nextFn: jasmine.Spy, errorFn: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule, HttpMockModule]
    });
    nextFn = jasmine.createSpy('next');
    errorFn = jasmine.createSpy('error');
  });

  afterEach(inject([MockBackend], (backend: MockBackend) => backend.verifyNoPendingRequests()));

  it('should be instantiated', inject([HttpMock], (mock: HttpMock) => {
    expect(mock).toBeDefined();
  }));

  it('should mock response', inject([Http, HttpMock], (http: Http, mock: HttpMock) => {
    mock.match({url: 'http://testserver/api/'}).andRespond({
      status: 200,
      body: 'ok'
    });

    http.get('http://testserver/api/').subscribe(
      nextFn.and.callFake((response: Response) => {
        expect(response.status).toBe(200);
        expect(response.url).toBe('http://testserver/api/');
        expect(response.text()).toBe('ok');
      }),
      errorFn
    );

    expect(nextFn).toHaveBeenCalled();
    expect(errorFn).not.toHaveBeenCalled();
  }));

  it('should mock error response', inject([Http, HttpMock], (http: Http, mock: HttpMock) => {
    mock.match({url: 'http://testserver/api/'}).andRespond({
      status: 400,
      body: 'Bad request'
    });

    http.get('http://testserver/api/').subscribe(
      nextFn,
      errorFn.and.callFake((error: HttpMockError) => {
        expect(error.status).toBe(400);
        expect(error.message).toBe('Bad request');
      })
    );

    expect(nextFn).not.toHaveBeenCalled();
    expect(errorFn).toHaveBeenCalled();
  }));

  it('should mock multiple responses', inject([Http, HttpMock], (http: Http, mock: HttpMock) => {
    mock.match({url: 'http://testserver/404/'}).andRespond({
      status: 404,
      body: 'not found'
    });
    mock.match({url: 'http://testserver/api/'}).andRespond({
      status: 200,
      body: 'ok'
    });

    http.get('http://testserver/404/').subscribe(
      nextFn,
      errorFn.and.callFake((error: HttpMockError) => {
        expect(error.status).toBe(404);
      })
    );
    http.get('http://testserver/200/').subscribe(
      nextFn.and.callFake((response: Response) => {
        expect(response.status).toBe(200);
      }),
      errorFn
    );

    expect(nextFn).not.toHaveBeenCalled();
    expect(errorFn).toHaveBeenCalled();
  }));

  it('should record success response', inject([Http, HttpMock], (http: Http, mock: HttpMock) => {
    mock.match({url: 'http://testserver/api/'}).andRespond({
      status: 200,
      body: 'ok'
    });
    expect(mock.responses.length).toBe(0);

    http.get('http://testserver/api/').subscribe(nextFn, errorFn);

    expect(nextFn).toHaveBeenCalled();
    expect(errorFn).not.toHaveBeenCalled();
    expect(mock.responses.length).toBe(1);
    expect(mock.responses[0].url).toBe('http://testserver/api/');
    expect(mock.responses[0].text()).toBe('ok');
  }));

  it('should record error response', inject([Http, HttpMock], (http: Http, mock: HttpMock) => {
    mock.match({url: 'http://testserver/api/'}).andRespond({
      status: 404,
      body: 'not found'
    });
    expect(mock.responses.length).toBe(0);

    http.get('http://testserver/api/').subscribe(nextFn, errorFn);

    expect(nextFn).not.toHaveBeenCalled();
    expect(errorFn).toHaveBeenCalled();
    expect(mock.responses.length).toBe(1);
    expect(mock.responses[0].url).toBe('http://testserver/api/');
    expect(mock.responses[0].text()).toBe('not found');
  }));

  it('should record several responses', inject([Http, HttpMock], (http: Http, mock: HttpMock) => {
    mock.match({url: 'http://testserver/api/'}).andRespond({
      status: 200,
      body: 'ok'
    });

    http.get('http://testserver/api/').subscribe(nextFn, errorFn);
    http.get('http://testserver/api/').subscribe(nextFn, errorFn);

    expect(nextFn).toHaveBeenCalledTimes(2);
    expect(errorFn).not.toHaveBeenCalled();
    expect(mock.responses.length).toBe(2);
    expect(mock.responses[0].url).toBe('http://testserver/api/');
    expect(mock.responses[1].url).toBe('http://testserver/api/');
  }));

});
