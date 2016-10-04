import {NgModule} from '@angular/core';
import {HttpModule, Http, BaseRequestOptions} from '@angular/http';
import {MockBackend} from '@angular/http/testing';

import {HttpMock} from './http-mock';


const MOCK_HTTP_PROVIDER = {
  provide: Http,
  deps: [MockBackend, BaseRequestOptions],
  useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
    return new Http(backend, defaultOptions);
  }
};

export const MOCK_XHR_PROVIDERS = [
  MockBackend,
  BaseRequestOptions,
  MOCK_HTTP_PROVIDER,
  HttpMock,
];


@NgModule({
  imports: [
    HttpModule
  ],
  providers: MOCK_XHR_PROVIDERS,
})
export class HttpMockModule {
}
