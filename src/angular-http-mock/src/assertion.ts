/**
 * Created by Evgeniy_Generalov on 10/4/2016.
 */

import {ResponseOptions, Request, RequestMethod} from '@angular/http';
import {normalizeMethodName} from '@angular/http/src/http_utils';
import {isPresent} from '@angular/common/src/facade/lang';


export interface MatchRuleArgs {
  method?: string|RequestMethod;
  url?: string | RegExp;
}

export class MatchRule {
  method: RequestMethod;
  url: string | RegExp;

  constructor({method, url}: MatchRuleArgs = {}) {
    this.method = isPresent(method) ? normalizeMethodName(method) : null;
    this.url = isPresent(url) ? url : null;
  }
}

export interface Assertion {
  test: (httpRequest: Request) => boolean;
}

export class RequestAssertion implements Assertion {
  public rule: MatchRule;
  public responseOptions: ResponseOptions;

  constructor(rule: MatchRule, responseOptions: ResponseOptions) {
    this.rule = rule;
    this.responseOptions = responseOptions;
  }

  test(httpRequest: Request) {
    const allValidators: [[any, (httpRequest: Request) => boolean]] = [
      [this.rule.method, this._testRequestMethod],
      [this.rule.url, this._testRequestUrl]
    ];
    const validators = allValidators.filter(value => isPresent(value[0]));

    return !!validators.length && validators.every(value => value[1].call(this, httpRequest));
  };

  private _testRequestMethod(httpRequest: Request): boolean {
    return this.rule.method === httpRequest.method;
  }

  private _testRequestUrl(httpRequest: Request): boolean {
    if (this.rule.url instanceof RegExp) {
      let urlRe = <RegExp>this.rule.url;
      return !!urlRe.test(httpRequest.url);
    } else {
      return this.rule.url === httpRequest.url;
    }
  }
}
