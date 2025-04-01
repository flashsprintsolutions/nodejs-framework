import { Request } from 'express';
import { middleware } from '../../../src/annotation/middleware';
import { Middleware } from '../../../src/declarations/middleware';
import { incrementCallCount } from '../visit-count';

@middleware()
export class FirstMiddleware extends Middleware {
  async handler(request: Request): Promise<void> {
    incrementCallCount('FirstMiddlewareHandler');
    await Promise.resolve(request);
  }
}
