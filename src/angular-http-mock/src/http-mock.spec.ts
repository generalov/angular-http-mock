import {inject, TestBed} from '@angular/core/testing';

import {HttpMock} from './http-mock';
import {MockBackend} from '@angular/http/testing';
import {Observable} from 'rxjs';
import {ResponseOptions} from '@angular/http';


describe('HttpMock', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpMock,
        {
          provide: MockBackend,
          useValue: {
            connections: Observable.create((observer: any) => {
            })
          }
        }
      ]
    });
  });

  it('should be instantiated', inject([HttpMock], (mock: HttpMock) => {
    expect(mock).toBeDefined();
  }));

  describe('assertions', () => {
    it('should be defined', inject([HttpMock], (httpMock: HttpMock) => {
      expect(httpMock.assertions).toBeDefined();
    }));
  });

  describe('match()', () => {
    it('should be defined', inject([HttpMock], (httpMock: HttpMock) => {
      expect(httpMock.match).toBeDefined();
    }));

    it('should accept GET method', inject([HttpMock], (httpMock: HttpMock) => {
      expect(httpMock.match(({method: 'GET'}))).toBeDefined();
    }));

    it('should be fluent', inject([HttpMock], (httpMock: HttpMock) => {
      expect(httpMock.match(({method: 'GET'}))).toEqual(httpMock);
    }));

    it(`should throw Error if previous rule incomplete`, inject([HttpMock], (httpMock: HttpMock) => {
      httpMock.match({method: 'GET'});
      expect(() => httpMock.match({method: 'GET'})).toThrowError('Logic error');
    }));

  });

  describe('andRespond()', () => {
    it('should be defined', inject([HttpMock], (httpMock: HttpMock) => {
      expect(httpMock.andRespond).toBeDefined();
    }));

    it(`should throw Error if no rules`, inject([HttpMock], (httpMock: HttpMock) => {
      expect(() => httpMock.andRespond(new ResponseOptions({status: 200}))).toThrowError('Logic error');
    }));

    it('should append rule', inject([HttpMock], (httpMock: HttpMock) => {
      expect(httpMock.assertions.length).toEqual(0);
      const responseOptions: ResponseOptions = new ResponseOptions({status: 200});
      httpMock.match({method: 'GET'}).andRespond(responseOptions);
      expect(httpMock.assertions.length).toEqual(1);
    }));

    it('should be fluent', inject([HttpMock], (httpMock: HttpMock) => {
      httpMock.match({method: 'GET'});
      expect(httpMock.andRespond(new ResponseOptions({status: 200}))).toEqual(httpMock);
    }));
  });

});

