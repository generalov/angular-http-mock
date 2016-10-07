/**
 * Created by Evgeniy_Generalov on 10/6/2016.
 */
import {Response, ResponseOptions} from '@angular/http';

import {HttpMockError} from './http-mock-error';


describe('HttpMockError', () => {
  it('should be defined', () => {
    expect(HttpMockError).toBeDefined();
  });

  it('should be creatable', () => {
    const error = new HttpMockError(
      'error message',
      null,
      new Response(new ResponseOptions({status: 400}))
    );
    expect(error.message).toBe('error message');
    expect(error.xhr).toBe(null);
    expect(error.status).toBe(400);
  });
});
