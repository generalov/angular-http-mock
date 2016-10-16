import {Response, HttpModule, Http} from '@angular/http';
import {inject, TestBed} from '@angular/core/testing';
import {MockBackend} from '@angular/http/testing';

import {HttpMock} from '../src/http-mock';
import {HttpMockModule} from '../src/http-mock.module';
import {HttpMockError} from '../src/http-mock-error';
import {Observable} from 'rxjs';


describe('HttpMockModule', () => {
  let nextFn: jasmine.Spy, errorFn: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule, HttpMockModule]
    });
    nextFn = jasmine.createSpy('next');
    errorFn = jasmine.createSpy('error');
  });

  afterEach(inject([MockBackend],
    (backend: MockBackend) => backend.verifyNoPendingRequests()
  ));

  it('should be instantiated', inject([HttpMock],
    (httpMock: HttpMock) => {
      expect(httpMock).toBeDefined();
    })
  );

  it('should mock response', inject([Http, HttpMock],
    (http: Http, httpMock: HttpMock) => {
      httpMock.when({url: 'http://testserver/api/'}).respond({
        status: 200,
        body: 'ok'
      });

      http.get('http://testserver/api/').subscribe(nextFn, errorFn);

      expect(errorFn).not.toHaveBeenCalled();
      expect(nextFn).toHaveBeenCalled();
      const response: Response = nextFn.calls.mostRecent().args[0];
      expect(response.status).toBe(200);
      expect(response.url).toBe('http://testserver/api/');
      expect(response.text()).toBe('ok');
    })
  );

  it('should mock error response', inject([Http, HttpMock],
    (http: Http, httpMock: HttpMock) => {
      httpMock.when({url: 'http://testserver/api/'}).respond({
        status: 400,
        body: 'Bad request'
      });

      http.get('http://testserver/api/').subscribe(nextFn, errorFn);

      expect(nextFn).not.toHaveBeenCalled();
      expect(errorFn).toHaveBeenCalled();
      const error: HttpMockError = errorFn.calls.mostRecent().args[0];
      expect(error.status).toBe(400);
      expect(error.message).toBe('Bad request');
    })
  );

  it('should mock multiple responses', inject([Http, HttpMock],
    (http: Http, httpMock: HttpMock) => {
      httpMock.when({url: 'http://testserver/404/'}).respond({
        status: 404,
        body: 'not found'
      });
      httpMock.when({url: 'http://testserver/api/'}).respond({
        status: 200,
        body: 'ok'
      });

      http.get('http://testserver/404/').subscribe(nextFn, errorFn);
      http.get('http://testserver/api/').subscribe(nextFn, errorFn);

      expect(nextFn).toHaveBeenCalled();
      expect(nextFn.calls.mostRecent().args[0].status).toBe(200);
      expect(errorFn).toHaveBeenCalled();
      expect(errorFn.calls.mostRecent().args[0].status).toBe(404);
    })
  );

  it('should record success response', inject([Http, HttpMock],
    (http: Http, httpMock: HttpMock) => {
      httpMock.when({url: 'http://testserver/api/'}).respond({
        status: 200,
        body: 'ok'
      });
      expect(httpMock.responses.length).toBe(0);

      http.get('http://testserver/api/').subscribe(nextFn, errorFn);

      expect(errorFn).not.toHaveBeenCalled();
      expect(nextFn).toHaveBeenCalled();
      expect(httpMock.responses.length).toBe(1);
      expect(httpMock.responses[0].url).toBe('http://testserver/api/');
      expect(httpMock.responses[0].text()).toBe('ok');
    })
  );

  it('should record error response', inject([Http, HttpMock],
    (http: Http, httpMock: HttpMock) => {
      httpMock.when({url: 'http://testserver/api/'}).respond({
        status: 404,
        body: 'not found'
      });
      expect(httpMock.responses.length).toBe(0);

      http.get('http://testserver/api/').subscribe(nextFn, errorFn);

      expect(nextFn).not.toHaveBeenCalled();
      expect(errorFn).toHaveBeenCalled();
      expect(httpMock.responses.length).toBe(1);
      expect(httpMock.responses[0].url).toBe('http://testserver/api/');
      expect(httpMock.responses[0].text()).toBe('not found');
    })
  );

  it('should record several responses', inject([Http, HttpMock],
    (http: Http, httpMock: HttpMock) => {
      httpMock.when({url: 'http://testserver/api/'}).respond({
        status: 200,
        body: 'ok'
      });

      http.get('http://testserver/api/').subscribe(nextFn, errorFn);
      http.get('http://testserver/api/').subscribe(nextFn, errorFn);

      expect(errorFn).not.toHaveBeenCalled();
      expect(nextFn).toHaveBeenCalledTimes(2);
      expect(httpMock.responses.length).toBe(2);
      expect(httpMock.responses[0].url).toBe('http://testserver/api/');
      expect(httpMock.responses[1].url).toBe('http://testserver/api/');
    })
  );

  describe('sample data provider test', () => {
    let dataProvider = (http: Http): Observable<string> =>
      http.get('http://testserver/api/')
        .map((res: Response) => res.json())
        .map((data: {message: string}) => data.message)
        .catch((error: any) => Observable.throw('Server error'));

    let wsSpec = {
      request: {method: 'GET', url: 'http://testserver/api/'},
      success: {status: 200, body: '{"message": "ok"}'},
      serverError: {status: 502, body: 'Bad gateway'}
    };

    it(`should be usable in success tests`, inject([Http, HttpMock],
      (http: Http, httpMock: HttpMock) => {
        httpMock
          .when(wsSpec.request)
          .respond(wsSpec.success);

        dataProvider(http).subscribe(nextFn, errorFn);

        expect(errorFn).not.toHaveBeenCalled();
        expect(nextFn).toHaveBeenCalled();
        expect(httpMock.responses[0].status).toBe(200);
        expect(nextFn.calls.mostRecent().args[0]).toBe('ok');
      })
    );

    it(`should be usable in error tests`, inject([Http, HttpMock],
      (http: Http, httpMock: HttpMock) => {
        httpMock
          .when(wsSpec.request)
          .respond(wsSpec.serverError);

        dataProvider(http).subscribe(nextFn, errorFn);

        expect(errorFn).toHaveBeenCalled();
        expect(nextFn).not.toHaveBeenCalled();
        expect(httpMock.responses[0].status).toBe(502);
        expect(errorFn.calls.mostRecent().args[0]).toBe('Server error');
      })
    );
  });
});
