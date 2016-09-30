import {Response, ResponseOptions, HttpModule, Http} from '@angular/http';
import {async, inject, TestBed} from '@angular/core/testing';

import {HttpMock} from './http-mock';
import {HttpMockModule} from './http-mock.module';
import {MockBackend} from '@angular/http/testing';


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

  it('should mock GET request', async(inject([HttpMock, Http], (mock: HttpMock, http: Http) => {
    const responseData = {
      status: 200,
      body: 'ok'
    };
    mock.get('http://testserver/api/').andRespond(<ResponseOptions>responseData);
    http.get('http://testserver/api/').subscribe(
      (response: Response) => {
        expect(response.url).toEqual('http://testserver/api/');
        expect(response.status).toEqual(responseData.status);
        expect(response.text()).toEqual(responseData.body);
      },
      (error) => expect(error).toBeUndefined()
    );
  })));

});

