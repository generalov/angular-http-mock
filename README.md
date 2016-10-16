# AngularHttpMock

[![npm](https://img.shields.io/npm/v/@generalov/angular-http-mock.svg)](https://www.npmjs.com/package/@generalov/angular-http-mock)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/generalov/angular-http-mock/master/LICENSE)
[![Build Status](https://travis-ci.org/generalov/angular-http-mock.svg?branch=master)](https://travis-ci.org/generalov/angular-http-mock)
[![Code Climate](https://codeclimate.com/github/generalov/angular-http-mock/badges/gpa.svg)](https://codeclimate.com/github/generalov/angular-http-mock)
[![Test Coverage](https://codeclimate.com/github/generalov/angular-http-mock/badges/coverage.svg)](https://codeclimate.com/github/generalov/angular-http-mock/coverage)
[![dependencies Status](https://david-dm.org/generalov/angular-http-mock/status.svg)](https://david-dm.org/generalov/angular-http-mock)
[![devDependencies Status](https://david-dm.org/generalov/angular-http-mock/dev-status.svg)](https://david-dm.org/generalov/angular-http-mock?type=dev)

A utility library for mocking out the requests in Angular2 Http module.

## Installation

```sh
npm install --save-dev @generalov/angular-http-mock
```

## Usage

### Setup a test suite

```TypeScript
import {Response, HttpModule, Http} from '@angular/http';
import {inject, TestBed} from '@angular/core/testing';
import {MockBackend} from '@angular/http/testing';

import {HttpMockModule, HttpMock} from '@generalov/angular-http-mock';


describe('HttpMock usage', () => {
  let nextFn: jasmine.Spy, errorFn: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule, HttpMockModule]
    });
    nextFn = jasmine.createSpy('next');
    errorFn = jasmine.createSpy('error');
  });

  afterEach(inject([MockBackend], (backend: MockBackend) => {
    backend.verifyNoPendingRequests();
  }));

  // Put your specs here
});
```

### Mock Http request

```TypeScript
  it('should mock response',
    inject([Http, HttpMock], (http: Http, httpMock: HttpMock) => {
      httpMock.match({url: /api/}).andRespond({
        status: 200,
        body: 'ok'
      });

      http.get('http://testserver/api/').subscribe(nextFn, errorFn);

      expect(errorFn).not.toHaveBeenCalled();
      expect(nextFn).toHaveBeenCalled();
      expect(httpMock.responses[0].status).toBe(200);
      expect(httpMock.responses[0].url).toBe('http://testserver/api/');
      expect(httpMock.responses[0].text()).toBe('ok');
    })
  );
```

### Mock Http request in data provider's test

```TypeScript
  let dataProvider = (http) =>
    return http.get('http://testserver/api/')
      .map((res: Response) => res.json())
      .map((data: {message: string}) => data.message)
      .catch((error: any): string => Observable.throw('Server error'));
```

```TypeScript
  let wsSpec = {
    api: {
      request: {method: 'GET', url: 'http://testserver/api/'},
      success: {
        status: 200,
        body: '{"message": "ok"}'
      },
      serverError: {
        status: 502,
        body: 'Bad gateway'
      }
    }
  };
```

```TypeScript
  it(`should be usable in the success test`,
    inject([Http, HttpMock], (http: Http, httpMock: HttpMock) => {
      httpMock
        .match(wsSpec.api.request)
        .andRespond(wsSpec.api.success);

      dataProvider(http).subscribe(nextFn, errorFn);

      expect(errorFn).not.toHaveBeenCalled();
      expect(nextFn).toHaveBeenCalled();
      expect(nextFn.calls.mostRecent().args[0]).toBe('ok');
    })
  );

  it(`should be usable in the typical error test`,
    inject([Http, HttpMock], (http: Http, httpMock: HttpMock) => {
      httpMock
        .match(wsSpec.api.request)
        .andRespond(wsSpec.api.serverError);

      dataProvider(http).subscribe(nextFn, errorFn);

      expect(nextFn).not.toHaveBeenCalled();
      expect(errorFn).toHaveBeenCalled();
      expect(httpMock.responses[0].status).toBe(502);
      expect(errorFn.calls.mostRecent().args[0]).toBe('Server error');
    })
  );
```

## Build

Run `npm run build` to build the project. The build artifacts will be
stored in the `dist/` directory.

## Running unit tests

Run `npm run test` to execute the unit tests via [Karma][karma].

## Inspired by

* [https://github.com/ryanzec/backend](https://github.com/ryanzec/backend)
* [https://github.com/jasmine/jasmine-ajax/](https://github.com/jasmine/jasmine-ajax/)

## Links

* [https://angular.io/docs/ts/latest/guide/testing.html](https://angular.io/docs/ts/latest/guide/testing.html)
* [https://developers.livechatinc.com/blog/testing-angular-2-apps-routeroutlet-and-http/](https://developers.livechatinc.com/blog/testing-angular-2-apps-routeroutlet-and-http/)
* [https://angular.io/docs/ts/latest/guide/server-communication.html](https://angular.io/docs/ts/latest/guide/server-communication.html)

This project was generated with [angular-cli][angular-cli]
version 1.0.0-beta.15.

## License

MIT

[angular-cli]: https://github.com/angular/angular-cli
[karma]: https://karma-runner.github.io


