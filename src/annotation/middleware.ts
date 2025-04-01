import { getContainer } from '../declarations/cache-config';
import { loadInContainer } from '../declarations/global-container';
import { Middleware } from '../declarations/middleware';

export function middleware(): (Target: new () => Middleware) => void {
  return function decorator(Target: new () => Middleware): void {
    loadInContainer(getContainer('middleware'), Target);
  };
}
