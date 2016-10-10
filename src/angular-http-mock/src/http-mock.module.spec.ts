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

  afterEach(inject([MockBackend],
    (backend: MockBackend) => backend.verifyNoPendingRequests()
  ));

  it('should be instantiated', inject([HttpMock],
    (mock: HttpMock) => {
      expect(mock).toBeDefined();
    })
  );

  it('should mock response', inject([Http, HttpMock],
    (http: Http, mock: HttpMock) => {
      mock.match({url: 'http://testserver/api/'}).andRespond({
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
    (http: Http, mock: HttpMock) => {
      mock.match({url: 'http://testserver/api/'}).andRespond({
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
    (http: Http, mock: HttpMock) => {
      mock.match({url: 'http://testserver/404/'}).andRespond({
        status: 404,
        body: 'not found'
      });
      mock.match({url: 'http://testserver/api/'}).andRespond({
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
    (http: Http, mock: HttpMock) => {
      mock.match({url: 'http://testserver/api/'}).andRespond({
        status: 200,
        body: 'ok'
      });
      expect(mock.responses.length).toBe(0);

      http.get('http://testserver/api/').subscribe(nextFn, errorFn);

      expect(errorFn).not.toHaveBeenCalled();
      expect(nextFn).toHaveBeenCalled();
      expect(mock.responses.length).toBe(1);
      expect(mock.responses[0].url).toBe('http://testserver/api/');
      expect(mock.responses[0].text()).toBe('ok');
    })
  );

  it('should record error response', inject([Http, HttpMock],
    (http: Http, mock: HttpMock) => {
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
    })
  );

  it('should record several responses', inject([Http, HttpMock],
    (http: Http, mock: HttpMock) => {
      mock.match({url: 'http://testserver/api/'}).andRespond({
        status: 200,
        body: 'ok'
      });

      http.get('http://testserver/api/').subscribe(nextFn, errorFn);
      http.get('http://testserver/api/').subscribe(nextFn, errorFn);

      expect(errorFn).not.toHaveBeenCalled();
      expect(nextFn).toHaveBeenCalledTimes(2);
      expect(mock.responses.length).toBe(2);
      expect(mock.responses[0].url).toBe('http://testserver/api/');
      expect(mock.responses[1].url).toBe('http://testserver/api/');
    })
  );

  it(`should be usable in the typical data provider's test`, inject([Http, HttpMock],
    (http: Http, mock: HttpMock) => {
      let wsSpec = {
        request: {method: 'GET', url: 'http://testserver/api/'},
        success: {status: 200, body: '{"message": "ok"}'}
      };
      let dataProvider = () =>
        http.get('http://testserver/api/')
          .map((res: Response) => res.json())
          .map((data: {message: string}) => data.message)
          .share();

      mock.match(wsSpec.request).andRespond(wsSpec.success);

      dataProvider().subscribe(nextFn, errorFn);

      expect(errorFn).not.toHaveBeenCalled();
      expect(nextFn).toHaveBeenCalled();
      expect(nextFn.calls.mostRecent().args[0]).toBe('ok');
    })
  );
});
