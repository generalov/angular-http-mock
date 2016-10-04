# AngularHttpMock


[![npm](https://img.shields.io/npm/v/@generalov/angular-http-mock.svg)](https://www.npmjs.com/package/@generalov/angular-http-mock)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/generalov/angular-http-mock/master/LICENSE)
master: [![Build Status](https://travis-ci.org/generalov/angular-http-mock.svg?branch=master)](https://travis-ci.org/generalov/angular-http-mock)
devel: [![Build Status](https://travis-ci.org/generalov/angular-http-mock.svg?branch=devel)](https://travis-ci.org/generalov/angular-http-mock)
[![Code Climate](https://codeclimate.com/github/generalov/angular-http-mock/badges/gpa.svg)](https://codeclimate.com/github/generalov/angular-http-mock)
[![Test Coverage](https://codeclimate.com/github/generalov/angular-http-mock/badges/coverage.svg)](https://codeclimate.com/github/generalov/angular-http-mock/coverage)

A utility library for mocking out the requests in Angular2 Http module.

This project was generated with [angular-cli](https://github.com/angular/angular-cli) version 1.0.0-beta.15.

## Basic Usage

```TypeScript
import {AngularHttpMock} from 'angular-http-mock';

@Injectable()
class CUTService {
  constructor(private _http: Http) {
  }

  getData() {
    return this._http.get('http://testserver/api/');
  }
}
```

```TypeScript
describe('CUTService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CUTService],
      imports: [HttpMockModule]
    });
  });

  afterEach(inject([MockBackend], (backend: MockBackend) => backend.verifyNoPendingRequests()));

  it('should be instantiated', inject([CUTService], (service: CUTService) => {
    expect(service).toBeDefined();
  }));

  it('should mock GET request', inject([CUTService, HttpMock], (service: CUTService, mock: HttpMock) => {
    const responseData = new ResponseOptions({
      status: 200,
      body: 'ok'
    });
    mock.match({url: 'http://testserver/api/'}).andRespond(responseData);

    const nextFn = createSpy('next', (response: Response) => {
      expect(response.url).toEqual('http://testserver/api/');
      expect(response.status).toEqual(responseData.status);
      expect(response.text()).toEqual(responseData.body);
    });
    const errorFn = createSpy('error', (error: any) => {});

    service.getData().subscribe(nextFn, errorFn);

    expect(nextFn).toHaveBeenCalled();
    expect(errorFn).not.toHaveBeenCalled();
  }));
});
```

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `npm run test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Inspired by:

* https://github.com/ryanzec/backend
* https://github.com/jasmine/jasmine-ajax/

## Links:

* https://angular.io/docs/ts/latest/guide/testing.html
* https://developers.livechatinc.com/blog/testing-angular-2-apps-routeroutlet-and-http/
* https://angular.io/docs/ts/latest/guide/server-communication.html

## License

MIT
