import { NextFunction, Request, Response, RequestHandler } from 'express';
import { ErrorHandler, generateControllerRoutes } from '../common/handler';
import { Base } from './base';
import { getConfig } from './cache-config';
import { Route } from './route';
import { RouteType } from './route-type';

export class RouteCompiler extends Base {
  private static routes: Array<RouteType>;

  static attachErrorHandler(requestHandlers: Array<RequestHandler>, errorHandler: ErrorHandler): Array<RequestHandler> {
    return requestHandlers.map(
      (requestHandler) => async function routeHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          await requestHandler(req, res, next);
        } catch (error) {
          errorHandler(error as Error, req, res, next);
        }
      });
  }

  static generateRouter(errorHandler: ErrorHandler): Array<RouteType> {
    if (!RouteCompiler.routes) {
      const routeConfigs = getConfig((this as { classId?: string }).classId) as {
        routeConfig: Array<{ path: string; route: (typeof Route) & { classId?: string } }>;
      };
      RouteCompiler.routes = routeConfigs.routeConfig.map((each): Array<RouteType> => {
        const routes = generateControllerRoutes(each.route, errorHandler);
        return routes.map((routeType) => {
          return new RouteType({
            path: `${each.path}${routeType.path}`,
            method: routeType.method,
            classMethod: routeType.classMethod,
            requestHandler: RouteCompiler.attachErrorHandler(routeType.requestHandler, errorHandler),
          });
        });
      }).flat();
    }
    return RouteCompiler.routes;
  }
}
