/**
 * Created by Evgeniy Generalov on 9/30/2016.
 */
import {Injectable} from '@angular/core';
import {ResponseOptions, Response} from '@angular/http';
import {MockBackend, MockConnection} from '@angular/http/testing';

import {HttpMockError} from './http-mock-error';


@Injectable()
export class HttpMock {
  private _options: ResponseOptions;

  constructor(private _backend: MockBackend) {
    this._options = null;
    _backend.connections.subscribe((connection: MockConnection) => this.onConnection(connection));
  }

  get(url) {
    return this;
  }

  andRespond(options: ResponseOptions) {
    this._options = options;
  }

  onConnection(connection: MockConnection) {
    this._options.url = connection.request.url;
    const response = new Response(this._options);
    if (this._options.status < 400) {
      connection.mockRespond(response);
    } else {
      connection.mockError(new HttpMockError(response.text(), connection, response));
    }
  }
}
