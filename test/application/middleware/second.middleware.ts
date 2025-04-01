import { Request } from 'express';
import { middleware } from '../../../src/annotation/middleware';
import { Middleware } from '../../../src/declarations/middleware';
import { incrementCallCount } from '../visit-count';

@middleware()
export class SecondMiddleware extends Middleware {
  async handler(request: Request): Promise<void> {
    incrementCallCount('SecondMiddlewareHandler');
    await Promise.resolve(request);
  }
}
