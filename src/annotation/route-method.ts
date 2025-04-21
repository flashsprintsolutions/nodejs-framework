import { createRequestHandler, RequestMethodPropertyDescriptor, RouteMethodConfig } from '../common/handler';
import { Route } from '../declarations/route';
import { RouteType } from '../declarations/route-type';

export function GET<T = unknown>(
  path: string,
  routeConfig: RouteMethodConfig = {}): (...args: Array<unknown>) => RequestMethodPropertyDescriptor<T> {
  return function decorator(
    target: Route & { routes?: Array<RouteType> },
    classMethod: string,
    propertyDescriptor: RequestMethodPropertyDescriptor<T>,
  ): RequestMethodPropertyDescriptor<T> {
    return createRequestHandler<T>(target, 'get', path, classMethod, routeConfig, propertyDescriptor);
  };
}

export function POST<T = unknown>(
  path: string,
  routeConfig: RouteMethodConfig = {}): (...args: Array<unknown>) => RequestMethodPropertyDescriptor<T> {
  return function decorator(
    target: Route & { routes?: Array<RouteType> },
    classMethod_: string,
    propertyDescriptor: RequestMethodPropertyDescriptor<T>,
  ): RequestMethodPropertyDescriptor<T> {
    return createRequestHandler<T>(target, 'post', path, classMethod_, routeConfig, propertyDescriptor);
  };
}

export function PUT<T = unknown>(
  path: string,
  routeConfig: RouteMethodConfig = {}): (...args: Array<unknown>) => RequestMethodPropertyDescriptor<T> {
  return function decorator(
    target: Route & { routes?: Array<RouteType> },
    classMethod_: string,
    propertyDescriptor: RequestMethodPropertyDescriptor<T>,
  ): RequestMethodPropertyDescriptor<T> {
    return createRequestHandler<T>(target, 'put', path, classMethod_, routeConfig, propertyDescriptor);
  };
}

export function DELETE<T = unknown>(
  path: string,
  routeConfig: RouteMethodConfig = {}): (...args: Array<unknown>) => RequestMethodPropertyDescriptor<T> {
  return function decorator(
    target: Route & { routes?: Array<RouteType> },
    classMethod_: string,
    propertyDescriptor: RequestMethodPropertyDescriptor<T>,
  ): RequestMethodPropertyDescriptor<T> {
    return createRequestHandler<T>(target, 'delete', path, classMethod_, routeConfig, propertyDescriptor);
  };
}
