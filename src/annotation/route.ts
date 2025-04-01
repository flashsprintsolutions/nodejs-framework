import { Container } from 'inversify';
import { getContainer, setConfig } from '../declarations/cache-config';
import { loadInContainer } from '../declarations/global-container';
import { Middleware } from '../declarations/middleware';
import { Route } from '../declarations/route';

export declare interface RouteConfig<T extends new() => Route> {
  controller: new() => InstanceType<T>['controllerType'];
  middleware?: Array<new () => Middleware>;
  subRoutes?: Array<{ path: string; route: new () => Route }>;
}

export function route<T extends new() => Route>(config: RouteConfig<T>): (Target: T) => void {
  return function decorator(Target: T): void {
    const container = new Container();
    loadInContainer(container, config.controller);
    loadInContainer(getContainer('route'), Target);
    Object.assign(Target, { classId: setConfig({ ...config, container }) });
  };
}
