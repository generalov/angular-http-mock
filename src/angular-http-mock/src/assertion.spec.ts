/**
 * Created by Evgeniy_Generalov on 10/4/2016.
 */
import {RequestAssertion} from './assertion';
import {ResponseOptions} from '@angular/http';


describe('RequestAssertion', () => {
  it('should be defined', () => {
    expect(RequestAssertion).toBeDefined();
  });

  describe('rule', () => {
    let ra: RequestAssertion;
    beforeEach(() => {
      ra = new RequestAssertion({method: 'GET'}, new ResponseOptions({status: 200}));
    });
    it('should be defined', () => {
      expect(ra.rule).toBeDefined();
    });
  });

  describe('responseOptions', () => {
    let ra: RequestAssertion;
    beforeEach(() => {
      ra = new RequestAssertion({method: 'GET'}, new ResponseOptions({status: 200}));
    });
    it('should be defined', () => {
      expect(ra.responseOptions).toBeDefined();
    });
  });
});
