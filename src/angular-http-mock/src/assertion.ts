/**
 * Created by Evgeniy_Generalov on 10/4/2016.
 */

import {ResponseOptions} from '@angular/http';
export type RequestMethod =
  'GET' | 'POST' | 'PUT' | 'DELETE';


export type MatchRule = {method?: RequestMethod, url?: string};


export interface Assertion {
  verify: () => void;
}

export class RequestAssertion implements Assertion {
  constructor(public rule: MatchRule, public responseOptions: ResponseOptions) {
  }

  verify() {

  };
}
