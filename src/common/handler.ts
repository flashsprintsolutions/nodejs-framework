import express, {
  NextFunction, Request, RequestHandler, Response,
} from 'express';
import { getConfig, getContainer } from '../declarations/cache-config';
import { Middleware } from '../declarations/middleware';
import { Route } from '../declarations/route';
import { AllowedMethod, RouteType } from '../declarations/route-type';
import { RouteConfig } from '../annotation/route';
import { deepCopy } from '../util/deep-copy';

export declare type ErrorHandler = (error: Error, request: Request, response: Response, nextFunction: NextFunction) => void;

export declare interface RouteMethodConfig { middleware?: Array<new () => Middleware>; }

export declare interface RouteResponse<T = unknown> { response: T; status?: 'success' | 'failure'; statusCode?: number; }

export declare type RequestMethod<T = unknown> = (request?: express.Request) => Promise<RouteResponse<T>>;

export declare type RequestMethodPropertyDescriptor<T = unknown> = TypedPropertyDescriptor<RequestMethod<T>>;

declare type RouteWithCompileDate = Route & { routes?: Array<RouteType & { middlewareClass?: Array<new () => Middleware> }> };

export function handleErrorResponse(response: Response, error: Error): void {
  response.status(400).send(`Internal Server error. ${error.message}`);
}

function createMiddlewareHandler(ClassMiddlewares: Array<new () => Middleware>): Array<RequestHandler> {
  return ClassMiddlewares.map((ClassMiddleware): RequestHandler => {
    const controllerClassMiddleware = getContainer('middleware').get<Middleware>(ClassMiddleware);
    return async function middlewareHandler(request: express.Request, response: express.Response, next: NextFunction): Promise<void> {
      await controllerClassMiddleware.handler(request);
      next();
    };
  });
}

export function createRequestHandler<T>(
  target_: Route & { routes?: Array<RouteType & { middlewareClass?: Array<new () => Middleware> }> },
  requestMethod: AllowedMethod,
  path: string,
  classMethod: string,
  routeConfig: RouteMethodConfig,
  propertyDescriptor: RequestMethodPropertyDescriptor<T>,
): RequestMethodPropertyDescriptor<T> {
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

export function transformDateRequest(input: unknown): unknown {
  if (input === null || input === undefined) {
    return input;
  }
  if (typeof input !== 'object') {
    return input;
  }
  if ((input as { __type: 'Date' }).__type === 'Date' && (input as { iso: string }).iso) {
    return new Date((input as { iso: string }).iso);
  }
  return Object.keys(input).reduce((inputCopy, key) => {
    // eslint-disable-next-line no-param-reassign
    inputCopy[key] = transformDateRequest(input[key]);
    return inputCopy;
  }, deepCopy(input));
}

function transformDateResponse(input: unknown): unknown {
  if (input instanceof Date) {
    return { __type: 'Date', iso: input.toISOString() };
  }
  if (input === null || input === undefined) {
    return input;
  }
  if (typeof input !== 'object') {
    return input;
  }
  return Object.keys(input).reduce((inputCopy, key) => {
    // eslint-disable-next-line no-param-reassign
    inputCopy[key] = transformDateResponse(input[key]);
    return inputCopy;
  }, deepCopy(input));
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
      ...createMiddlewareHandler(routeConfig.middleware || []),
      ...routeType.requestHandler,
      async (request: Request, response: Response, next: NextFunction): Promise<void> => {
        try {
          const data: RouteResponse = await (currentRoute.controller[routeType.classMethod] as RequestMethod)(request);
          response.status(data.statusCode || 200).json({
            status: data.status || 'success',
            data: transformDateResponse(data.response),
          });
        } catch (error) {
          errorHandler(error as Error, request, response, next);
        }
      },
    ],
  }));
  routes.push(...methodRoutes);
  return routes;
}
