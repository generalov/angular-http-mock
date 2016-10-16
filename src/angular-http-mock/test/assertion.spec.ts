/**
 * Created by Evgeniy_Generalov on 10/4/2016.
 */
import {ResponseOptions, Request} from '@angular/http';

import {RequestAssertion, MatchRule} from '../src/assertion';


describe('RequestAssertion', () => {
  it('should be defined', () => {
    expect(RequestAssertion).toBeDefined();
  });

  describe('rule', () => {
    let ra: RequestAssertion;

    beforeEach(() => {
      ra = new RequestAssertion(new MatchRule({method: 'GET'}), new ResponseOptions({status: 200}));
    });

    it('should be defined', () => {
      expect(ra.rule).toBeDefined();
    });
  });

  describe('responseOptions', () => {
    let ra: RequestAssertion;

    beforeEach(() => {
      ra = new RequestAssertion(new MatchRule({method: 'GET'}), new ResponseOptions({status: 200}));
    });

    it('should be defined', () => {
      expect(ra.responseOptions).toBeDefined();
    });
  });

  describe('test()', () => {
    it('should be true then request method is same as expected', () => {
      const ra = new RequestAssertion(new MatchRule({method: 'GET'}), new ResponseOptions({status: 200}));
      const request = new Request({method: 'GET', url: 'any'});
      expect(ra.test(request)).toBe(true);
    });

    it('should be false then request method is different', () => {
      const ra = new RequestAssertion(new MatchRule({method: 'GET'}), new ResponseOptions({status: 200}));
      const request = new Request({method: 'POST', url: 'any'});
      expect(ra.test(request)).toBe(false);
    });

    it('should be false then expected method is undefined', () => {
      const ra = new RequestAssertion(new MatchRule({}), new ResponseOptions({status: 200}));
      const request = new Request({method: 'POST', url: 'any'});
      expect(ra.test(request)).toBe(false);
    });

    it('should be true then request url is the same as expected', () => {
      const ra = new RequestAssertion(new MatchRule({url: 'http://myserver/'}), new ResponseOptions({status: 200}));
      const request = new Request({url: 'http://myserver/'});
      expect(ra.test(request)).toBe(true);
    });

    it('should be true then request url is different', () => {
      const ra = new RequestAssertion(new MatchRule({url: 'http://myserver/'}), new ResponseOptions({status: 200}));
      const request = new Request({url: 'http://youserver/'});
      expect(ra.test(request)).toBe(false);
    });

    it('should be false then expected url is undefined', () => {
      const ra = new RequestAssertion(new MatchRule({}), new ResponseOptions({status: 200}));
      const request = new Request({url: 'http://youserver/'});
      expect(ra.test(request)).toBe(false);
    });

    it('should be true then request url when regexp', () => {
      const ra = new RequestAssertion(new MatchRule({url: /myserver/}), new ResponseOptions({status: 200}));
      const request = new Request({url: 'http://myserver/'});
      expect(ra.test(request)).toBe(true);
    });
  });
});
