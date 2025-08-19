import express, { Express } from 'express';
import { Application } from '../declarations/application';
import { setConfig } from '../declarations/cache-config';
import { RouteCompiler } from '../declarations/route-compiler';
import { Middleware } from '../declarations/middleware';

export declare type ApplicationConfig = {
  pathPrefix?: string;
  port: number;
  ip: string;
  routeCompiler: typeof RouteCompiler;
  routeValidator?: new () => Middleware;
};

export function application<T extends Application>(config: ApplicationConfig): (Target: new () => T & { app?: Express }) => void {
  return function decorator(Target: new () => T & { app?: Express }): void {
    const app: Express = express();
    Object.assign(Target, { aopId: setConfig({ ...config, app }) });

    new Target();
  };
}
