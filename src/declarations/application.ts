/* eslint-disable @typescript-eslint/no-unused-vars */
/* tslint:disable:no-empty */
import * as http from 'http';
import { Server } from 'http';
import { Express, NextFunction, Request, Response } from 'express';
import { ServiceIdentifier } from '@inversifyjs/common';
import { ApplicationConfig } from '../annotation/application';
import { handleErrorResponse } from '../common/handler';
import { Base } from './base';
import { getConfig, getContainer } from './cache-config';
import { Util } from './util';
import { Repository } from './repository';
import { Service } from './service';
import { RouteType } from './route-type';

export class Application extends Base {
  static getApp<T extends typeof Application>(this: T): Express {
    return (getConfig((this as { aopId?: string }).aopId) as { app: Express }).app;
  }

  static getServer<T extends typeof Application>(this: T): Server {
    return (getConfig((this as { aopId?: string }).aopId) as { server: Server }).server;
  }

  constructor() {
    super();
    const applicationConfig = getConfig((this.constructor as { aopId?: string }).aopId) as (
      ApplicationConfig & { app: Express; server: http.Server });
    this.beforeRouteRegistration(applicationConfig.app);
    if (applicationConfig.routeCompiler) {
      const routes = applicationConfig.routeCompiler.generateRouter((error, request, response, nextFunction) => {
        this.errorHandler(error, request, response, nextFunction);
      });
      this.registerApplicationRoutes(applicationConfig.app, routes, applicationConfig.pathPrefix);
      this.afterRouteRegistration(applicationConfig.app);
    }
    this.startServer(applicationConfig);
  }

  beforeRouteRegistration(app: Express): void {}

  afterRouteRegistration(app: Express): void {}

  afterServerStart(): void {}

  errorHandler(error: Error, _request: Request, response: Response, _nextFunction: NextFunction): void {
    handleErrorResponse(response, error);
  }

  protected getService<R extends Repository, T extends Service<R>>(ServiceClass: ServiceIdentifier<T>): T {
    return getContainer('service').get<T>(ServiceClass);
  }

  protected getUtil<T extends Util>(UtilClass: ServiceIdentifier<T>): T {
    return getContainer('util').get<T>(UtilClass);
  }

  private registerApplicationRoutes(app: Express, routes: Array<RouteType>, pathPrefix: string = ''): void {
    routes.forEach((route) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      app[(route.method || 'use').toLowerCase().trim()](`${pathPrefix}${route.path}`, ...route.requestHandler);
    });
  }

  private startServer(applicationConfig: ApplicationConfig & { app: Express; server?: Server; }): void {
    const server = applicationConfig.app.listen(applicationConfig.port, applicationConfig.ip, () => {
      // eslint-disable-next-line no-console
      console.log('Express server listening on %d, listening on "%s"', applicationConfig.port, applicationConfig.ip);
      this.afterServerStart();
    });
    Object.assign(applicationConfig, { server });
  }
}
