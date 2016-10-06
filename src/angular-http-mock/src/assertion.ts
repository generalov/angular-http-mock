/**
 * Created by Evgeniy_Generalov on 10/4/2016.
 */

import {ResponseOptions, Request} from '@angular/http';
import {normalizeMethodName} from '@angular/http/src/http_utils';
export type RequestMethod =
  'GET' | 'POST' | 'PUT' | 'DELETE';


export type MatchRule = {method?: RequestMethod, url?: string | RegExp};


export interface Assertion {
  test: (httpRequest: Request) => boolean;
}

export class RequestAssertion implements Assertion {
  constructor(public rule: MatchRule, public responseOptions: ResponseOptions) {
  }

  test(httpRequest: Request) {
    const allValidators = [
      [this.rule.method, this._testRequestMethod],
      [this.rule.url, this._testRequestUrl]
    ];
    const validators = allValidators.filter((value) => typeof value[0] !== 'undefined');
    return !!validators.length && validators.every((value) => value[1].call(this, httpRequest));
  };

  private _testRequestMethod(httpRequest: Request) {
    return normalizeMethodName(this.rule.method) === httpRequest.method;
  }

  private _testRequestUrl(httpRequest: Request) {
    if (this.rule.url instanceof RegExp) {
      let urlRe = <RegExp>this.rule.url;
      return urlRe.test(httpRequest.url);
    } else {
      return this.rule.url === httpRequest.url;
    }
  }
}
