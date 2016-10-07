# AngularHttpMock

[![npm](https://img.shields.io/npm/v/@generalov/angular-http-mock.svg)](https://www.npmjs.com/package/@generalov/angular-http-mock)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/generalov/angular-http-mock/master/LICENSE)
[![Build Status](https://travis-ci.org/generalov/angular-http-mock.svg?branch=master)](https://travis-ci.org/generalov/angular-http-mock)
[![Code Climate](https://codeclimate.com/github/generalov/angular-http-mock/badges/gpa.svg)](https://codeclimate.com/github/generalov/angular-http-mock)
[![Test Coverage](https://codeclimate.com/github/generalov/angular-http-mock/badges/coverage.svg)](https://codeclimate.com/github/generalov/angular-http-mock/coverage)

A utility library for mocking out the requests in Angular2 Http module.

## Basic Usage

```TypeScript
import {AngularHttpMock} from 'angular-http-mock';

describe('Basic usage', () => {
  beforeEach(() => TestBed.configureTestingModule({
      imports: [HttpModule, HttpMockModule]
 }));

  afterEach(inject([MockBackend], (backend: MockBackend) =>
      backend.verifyNoPendingRequests()
  ));

  it('should mock response',
    inject([Http, HttpMock], (http: Http, mock: HttpMock) => {
      const nextFn = jasmine.createSpy('next');
      const errorFn = jasmine.createSpy('error');

      mock.match({url: /api/}).andRespond({
        status: 200,
        body: 'ok'
      });

      http.get('http://testserver/api/').subscribe(nextFn, errorFn);

      expect(nextFn).toHaveBeenCalled();
      expect(errorFn).not.toHaveBeenCalled();
      expect(mock.responses[0].status).toEqual(200);
      expect(mock.responses[0].url).toEqual('http://testserver/api/');
      expect(mock.responses[0].text()).toEqual('ok');
    })
  );
});
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


