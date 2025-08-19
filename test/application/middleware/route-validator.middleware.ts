import { Request } from 'express';
import { middleware } from '../../../src/annotation/middleware';
import { Middleware } from '../../../src/declarations/middleware';
import { incrementCallCount } from '../visit-count';

@middleware()
export class RouteValidatorMiddleware extends Middleware {
  handler(_request: Request): Promise<void> {
    incrementCallCount('RouteValidatorMiddleware');
    return Promise.resolve();
  }
}
