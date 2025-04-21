/* eslint-disable @typescript-eslint/no-unused-vars */
/* tslint:disable:no-empty */
import * as http from 'http';
import { Server } from 'http';
import { Express, NextFunction, Request, Response, Router } from 'express';
import { ServiceIdentifier } from '@inversifyjs/common';
import { ApplicationConfig } from '../annotation/application';
import { Base } from './base';
import { getConfig, getContainer } from './cache-config';
import { Util } from './util';
import { Repository } from './repository';
import { Service } from './service';

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

  errorHandler(error: Error, request: Request, response: Response, nextFunction: NextFunction): void {
    nextFunction();
  }

  protected getService<R extends Repository, T extends Service<R>>(ServiceClass: ServiceIdentifier<T>): T {
    return getContainer('service').get<T>(ServiceClass);
  }

  protected getUtil<T extends Util>(UtilClass: ServiceIdentifier<T>): T {
    return getContainer('util').get<T>(UtilClass);
  }

  private registerApplicationRoutes(app: Express, routes: Router, pathPrefix: string): void {
    app.use(pathPrefix || '', routes);
  }

  private startServer(applicationConfig: ApplicationConfig & { app: Express; server: http.Server }): void {
    applicationConfig.server.listen(applicationConfig.port, applicationConfig.ip, () => {
      // eslint-disable-next-line no-console
      console.log('Express server listening on %d, listening on "%s"', applicationConfig.port, applicationConfig.ip);
      this.afterServerStart();
    });
  }
}
