import { Request } from 'express';
import { middleware } from '../../../src/annotation/middleware';
import { Middleware } from '../../../src/declarations/middleware';
import { incrementCallCount } from '../visit-count';

@middleware()
export class ErrorMiddleware extends Middleware {
  handler(_request: Request): Promise<void> {
    incrementCallCount('ErrorMiddlewareHandler');
    throw Error('unhandled error');
  }
}
