import { setConfig } from '../declarations/cache-config';
import { Route } from '../declarations/route';
import { RouteCompiler } from '../declarations/route-compiler';

export function routeCompiler<T extends new() => RouteCompiler>(
  routeConfig: Array<{ path: string; route: new() => Route }>): (Target: T) => void {
  return function decorator(Target: T): void {
    const classId = setConfig({ routeConfig });
    Object.assign(Target, { classId });
  };
}
