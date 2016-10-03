/**
 * Created by Evgeniy Generalov on 9/30/2016.
 */
import {Injectable} from '@angular/core';
import {ResponseOptions, Response} from '@angular/http';
import {MockBackend, MockConnection} from '@angular/http/testing';

import {HttpMockError} from './http-mock-error';
import {MatchRule, RequestAssertion, Assertion} from './assertion';


@Injectable()
export class HttpMock {
  public assertions: Array<Assertion>;
  private _currentRule: MatchRule;

  constructor(private _backend: MockBackend) {
    this.assertions = [];
    this._currentRule = null;
    _backend.connections.subscribe((connection: MockConnection) => this.onConnection(connection));
  }

  match(rule: MatchRule) {
    if (this._currentRule) {
      throw new Error('Logic error');
    }
    this._currentRule = rule;
    return this;
  }

  andRespond(options: ResponseOptions) {
    if (!this._currentRule) {
      throw new Error('Logic error');
    }
    this.assertions.push(new RequestAssertion(this._currentRule, options));
    this._currentRule = null;
    return this;
  }

  onConnection(connection: MockConnection) {
    const options: ResponseOptions = (<RequestAssertion>this.assertions[0]).responseOptions;
    options.url = connection.request.url;
    const response = new Response(options);
    if (options.status < 400) {
      connection.mockRespond(response);
    } else {
      connection.mockError(new HttpMockError(response.text(), connection, response));
    }
  }
}
