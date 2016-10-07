/**
 * Created by Evgeniy Generalov on 9/30/2016.
 */
import {Injectable} from '@angular/core';
import {ResponseOptions, Response, ResponseOptionsArgs, Request} from '@angular/http';
import {MockBackend, MockConnection} from '@angular/http/testing';

import {HttpMockError} from './http-mock-error';
import {MatchRule, RequestAssertion, Assertion} from './assertion';


export type AssertionStore = Array<Assertion>;
export type ResponseStore = Array<Response>;

@Injectable()
export class HttpMock {
  public assertions: AssertionStore;
  public responses: ResponseStore;
  private _currentRule: MatchRule;

  constructor(private _backend: MockBackend) {
    this.assertions = [];
    this.responses = [];
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

  andRespond(options: ResponseOptionsArgs) {
    if (!this._currentRule) {
      throw new Error('Logic error');
    }
    this.assertions.push(new RequestAssertion(this._currentRule, new ResponseOptions(options)));
    this._currentRule = null;
    return this;
  }

  onConnection(connection: MockConnection): void {
    const options: ResponseOptions = this._findOptions(connection.request);

    if (!options) {
    } else {
      options.url = connection.request.url;
      const response = new Response(options);
      this.responses.push(response);
      if (options.status < 400) {
        connection.mockRespond(response);
      } else {
        connection.mockError(new HttpMockError(response.text(), connection, response));
      }
    }
  }

  private _findOptions(request: Request) {
    const assertionOrUndefined = this.assertions.find((value: Assertion) => value.test(request));
    return assertionOrUndefined ? (<RequestAssertion>assertionOrUndefined).responseOptions : undefined;
  }
}
