import express, {
  NextFunction, Request, RequestHandler, Response,
} from 'express';
import { getConfig, getContainer } from '../declarations/cache-config';
import { Middleware } from '../declarations/middleware';
import { Route } from '../declarations/route';
import { AllowedMethod, RouteType } from '../declarations/route-type';
import { RouteConfig } from '../annotation/route';

export declare type ErrorHandler = (error: Error, request: Request, response: Response, nextFunction: NextFunction) => void;

export declare interface RouteMethodConfig { middleware?: Array<new () => Middleware>; }

export declare interface RouteResponse<T = unknown> { response: T; status?: 'success' | 'failure'; statusCode?: number; }

export declare type RequestMethod<T = unknown> = (request: express.Request) => Promise<RouteResponse<T>>;

export declare type RequestMethodPropertyDescriptor<T = unknown> = TypedPropertyDescriptor<RequestMethod<T>>;

declare type RouteWithCompileDate = Route & { routes?: Array<RouteType & { middlewareClass?: Array<new () => Middleware> }> };

function handleErrorResponse(response: Response, error: Error): void {
  response.status(400).send(`Internal Server error. ${error.message}`);
}

function createMiddlewareHandler(ClassMiddlewares: Array<new () => Middleware>, errorHandler?: ErrorHandler): Array<RequestHandler> {
  return ClassMiddlewares.map((ClassMiddleware): RequestHandler => {
    const controllerClassMiddleware = getContainer('middleware').get<Middleware>(ClassMiddleware);
    return (request: express.Request, response: express.Response, next: NextFunction): void => {
      try {
        controllerClassMiddleware.handler(request)
          // eslint-disable-next-line promise/no-callback-in-promise
          .then(() => next())
          .catch((error) => {
            throw error as Error;
          });
      } catch (error) {
        if (errorHandler) {
          errorHandler(error as Error, request, response, next);
          return;
        }
        throw error;
      }
    };
  });
}

export function createRequestHandler(
  target_: Route & { routes?: Array<RouteType & { middlewareClass?: Array<new () => Middleware> }> },
  requestMethod: AllowedMethod,
  path: string,
  classMethod: string,
  routeConfig: RouteMethodConfig,
  propertyDescriptor: RequestMethodPropertyDescriptor,
): RequestMethodPropertyDescriptor {
  const target = target_;
  if (!target.routes) {
    target.routes = [];
  }
  target.routes.push(new RouteType({
    path,
    method: requestMethod,
    classMethod,
    requestHandler: createMiddlewareHandler(routeConfig.middleware || []),
  }));
  return propertyDescriptor;
}

export function generateControllerRoutes(
  CurrentRoute: (new() => Route) & { classId?: string; },
  errorHandler: ErrorHandler): Array<RouteType> {
  const currentRoute = getContainer('route').get<RouteWithCompileDate>(CurrentRoute) as unknown as {
    controller: { routes: Array<RouteType & { middlewareClass?: Array<new () => Middleware> }> };
  };
  const controllerRoutes = currentRoute.controller.routes || [];
  const routeConfig = getConfig(CurrentRoute.classId) as unknown as  RouteConfig<new() => Route>;
  const subRoutes = routeConfig.subRoutes || [];
  const routes = subRoutes.flatMap(({ path, route }) => {
    const subRoutes = generateControllerRoutes(route, errorHandler);
    subRoutes.forEach((subRoute) => {
      subRoute.setPath(`${path}${subRoute.path}`);
    });
    return subRoutes;
  });
  const methodRoutes = controllerRoutes.map((routeType) => new RouteType({
    path: routeType.path,
    method: routeType.method,
    classMethod: routeType.classMethod,
    requestHandler: [
      ...createMiddlewareHandler(routeConfig.middleware || [], errorHandler),
      ...routeType.requestHandler,
      (request: Request, response: Response, next: NextFunction): void => {

        (currentRoute.controller[routeType.classMethod] as RequestMethod)(request)
          .then((data: RouteResponse) =>  {
            response.status(data.statusCode || 200).json({ status: data.status || 'success', data: data.response });
          })
          .catch((error: Error) => errorHandler(error, request, response, next))
          .catch((error: Error) => handleErrorResponse(response, error));
      },
    ],
  }));
  routes.push(...methodRoutes);
  return routes;
}
