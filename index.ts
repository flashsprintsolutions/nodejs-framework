import 'reflect-metadata';
import { interfaces } from 'inversify';
import { controller } from './src/annotation/controller';
import { db } from './src/annotation/db';
import { middleware } from './src/annotation/middleware';
import { port } from './src/annotation/port';
import { repository } from './src/annotation/repository';
import { route } from './src/annotation/route';
import { routeCompiler } from './src/annotation/route-compiler';
import { DELETE, GET, POST, PUT } from './src/annotation/route-method';
import { sdk } from './src/annotation/sdk';
import { adapter } from './src/annotation/adapter';
import { service } from './src/annotation/service';
import { util } from './src/annotation/util';
import { getContainer } from './src/declarations/cache-config';
import { Controller } from './src/declarations/controller';
import { Middleware } from './src/declarations/middleware';
import { Port } from './src/declarations/port';
import { Repository } from './src/declarations/repository';
import { Route } from './src/declarations/route';
import { RouteCompiler } from './src/declarations/route-compiler';
import { SDK } from './src/declarations/s-d-k';
import { Service } from './src/declarations/service';
import { Util } from './src/declarations/util';
import { Dependency } from './src/declarations/dependency';
import { dependency } from './src/annotation/dependency';

type ServiceIdentifier<T> = interfaces.ServiceIdentifier<T>;

function getMiddleware<T extends Middleware>(MiddlewareClass: ServiceIdentifier<T>): T {
  return getContainer('middleware').get(MiddlewareClass);
}

export {
  controller,
  dependency,
  db,
  getMiddleware,
  middleware,
  sdk,
  adapter,
  port,
  repository,
  route,
  routeCompiler,
  service,
  util,
  Controller,
  Dependency,
  DELETE,
  GET,
  Middleware,
  POST,
  PUT,
  Port,
  Repository,
  Route,
  RouteCompiler,
  SDK,
  Service,
  Util,
};
