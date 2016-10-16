# Angular 2 http mock

[![npm](https://img.shields.io/npm/v/@generalov/angular-http-mock.svg)](https://www.npmjs.com/package/@generalov/angular-http-mock)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/generalov/angular-http-mock/master/LICENSE)
[![Build Status](https://travis-ci.org/generalov/angular-http-mock.svg?branch=master)](https://travis-ci.org/generalov/angular-http-mock)
[![Code Climate](https://codeclimate.com/github/generalov/angular-http-mock/badges/gpa.svg)](https://codeclimate.com/github/generalov/angular-http-mock)
[![Test Coverage](https://codeclimate.com/github/generalov/angular-http-mock/badges/coverage.svg)](https://codeclimate.com/github/generalov/angular-http-mock/coverage)
[![dependencies Status](https://david-dm.org/generalov/angular-http-mock/status.svg)](https://david-dm.org/generalov/angular-http-mock)
[![devDependencies Status](https://david-dm.org/generalov/angular-http-mock/dev-status.svg)](https://david-dm.org/generalov/angular-http-mock?type=dev)

A utility library for mocking out the requests in Angular Http module.

## Installation

```sh
npm install --save-dev @generalov/angular-http-mock
```

## Usage

Let's look to the HeroService
from [Hero Saga](https://angular.io/docs/ts/latest/tutorial/toh-pt6.html).
It fetches a list of heroes from web API.

Here is a version of `app/hero.service.ts`:

```TypeScript
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { Hero } from './hero';

@Injectable()
export class HeroService {
  private heroesUrl = 'app/heroes';  // URL to web api

  constructor(private http: Http) { }

  getHeroes(): Observable<Hero[]> {
    return this.http
               .get(this.heroesUrl)
               .map((r: Response) => r.json().data as Hero[])
               .catch((error: any): string => Observable.throw('Server error'));
  }
}
```

We're going to trick the HTTP client into fetching and saving data from a mock service.

### Setup a test suite

`hero.service.spec.ts`

```TypeScript
import { inject, TestBed } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';

import { HttpMockModule, HttpMock } from '@generalov/angular-http-mock';

import { HeroService } from './hero.service';

describe('HttpMock usage', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HeroService,
        HttpMockModule
      ]
    });
  });

  afterEach(inject([MockBackend], (backend: MockBackend) => {
    backend.verifyNoPendingRequests();
  }));

  // Put your specs here
});
```

### Mock a regular Http response

```TypeScript
  it(`should return a heroes array`,
    inject([HeroService, HttpMock],
      (heroService: HeroService, httpMock: HttpMock) => {
         let nextFn: jasmine.Spy = jasmine.createSpy('next');
         let errorFn: jasmine.Spy = jasmine.createSpy('error');

         httpMock
           .match({ url: 'app/heroes', method: 'GET' })
           .andRespond({
              status: 200,
              body: '{"data": [{"id": 11, "name": "Mr. Nice" }]}'
           });

         heroService.getHeroes().subscribe(nextFn, errorFn);

         expect(httpMock.responses[0].url).toBe('app/heroes');
         expect(httpMock.responses[0].status).toBe(200);
         expect(errorFn).not.toHaveBeenCalled();
         expect(nextFn).toHaveBeenCalled();
         expect(nextFn.calls.mostRecent().args[0][0].id).toBe(11);
         expect(nextFn.calls.mostRecent().args[0][0].name).toBe('Mr. Nice');
    })
  );
```

### Mock an error Http response

```TypeScript
  it(`should handle a server error`,
    inject([HeroService, HttpMock],
      (heroService: HeroService, httpMock: HttpMock) => {
         let nextFn: jasmine.Spy = jasmine.createSpy('next');
         let errorFn: jasmine.Spy = jasmine.createSpy('error');

         httpMock
           .match({ url: 'app/heroes', method: 'GET' })
           .andRespond({
              status: 502,
              body: 'Bad gateway'
           });

         heroService.getHeroes().subscribe(nextFn, errorFn);

         expect(httpMock.responses[0].url).toBe('app/heroes');
         expect(httpMock.responses[0].status).toBe(502);
         expect(nextFn).not.toHaveBeenCalled();
         expect(errorFn).toHaveBeenCalled();
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


