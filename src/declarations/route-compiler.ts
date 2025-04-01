import express, { Router } from 'express';
import { ErrorHandler, generateControllerRoutes } from '../common/handler';
import { Base } from './base';
import { getConfig } from './cache-config';
import { Route } from './route';
import { RouteType } from './route-type';

export class RouteCompiler extends Base {
  private static router: Router;

  static generateRouter(errorHandler: ErrorHandler): Router {
    if (!RouteCompiler.router) {
      const routeConfigs = getConfig((this as { classId?: string }).classId) as {
        routeConfig: Array<{ path: string; route: (typeof Route) & { classId?: string } }>;
      };
      const router = express.Router();
      routeConfigs.routeConfig.map((each) => {
        const routes = generateControllerRoutes(each.route, errorHandler);
        return routes.map((routeType) => new RouteType({
          path: `${each.path}${routeType.path}`,
          method: routeType.method,
          classMethod: routeType.classMethod,
          requestHandler: routeType.requestHandler,
        })).flat().forEach((routeType) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          router[(routeType.method || 'use').toLowerCase().trim()](routeType.path, ...routeType.requestHandler);
        });
      });
      RouteCompiler.router = router;
    }
    return RouteCompiler.router;
  }
}
