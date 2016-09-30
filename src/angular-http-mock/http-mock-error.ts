/**
 * Created by Evgeniy_Generalov on 9/30/2016.
 */

import {MockConnection} from '@angular/http/testing';
import {Response} from '@angular/http';


export class HttpMockError extends Error {
  /** @type {MockConnection} The MockConnection instance associated with the error */
  xhr: MockConnection;
  /** @type {number} The HTTP status code */
  status: number;

  constructor(message: string, xhr: MockConnection, response: Response) {
    super(message);
    this.message = message;
    this.xhr = xhr;
    this.status = response.status;
  }
}
