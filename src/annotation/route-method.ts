import { createRequestHandler, RequestMethodPropertyDescriptor, RouteMethodConfig } from '../common/handler';
import { Route } from '../declarations/route';
import { RouteType } from '../declarations/route-type';

export function GET(path: string, routeConfig: RouteMethodConfig = {}): (...args: Array<unknown>) => RequestMethodPropertyDescriptor {
  return function decorator(
    target: Route & { routes?: Array<RouteType> },
    classMethod: string,
    propertyDescriptor: RequestMethodPropertyDescriptor,
  ): RequestMethodPropertyDescriptor {
    return createRequestHandler(target, 'get', path, classMethod, routeConfig, propertyDescriptor);
  };
}

export function POST(path: string, routeConfig: RouteMethodConfig = {}): (...args: Array<unknown>) => RequestMethodPropertyDescriptor {
  return function decorator(
    target: Route & { routes?: Array<RouteType> },
    classMethod_: string,
    propertyDescriptor: RequestMethodPropertyDescriptor,
  ): RequestMethodPropertyDescriptor {
    return createRequestHandler(target, 'post', path, classMethod_, routeConfig, propertyDescriptor);
  };
}

export function PUT(path: string, routeConfig: RouteMethodConfig = {}): (...args: Array<unknown>) => RequestMethodPropertyDescriptor {
  return function decorator(
    target: Route & { routes?: Array<RouteType> },
    classMethod_: string,
    propertyDescriptor: RequestMethodPropertyDescriptor,
  ): RequestMethodPropertyDescriptor {
    return createRequestHandler(target, 'put', path, classMethod_, routeConfig, propertyDescriptor);
  };
}

export function DELETE(path: string, routeConfig: RouteMethodConfig = {}): (...args: Array<unknown>) => RequestMethodPropertyDescriptor {
  return function decorator(
    target: Route & { routes?: Array<RouteType> },
    classMethod_: string,
    propertyDescriptor: RequestMethodPropertyDescriptor,
  ): RequestMethodPropertyDescriptor {
    return createRequestHandler(target, 'delete', path, classMethod_, routeConfig, propertyDescriptor);
  };
}
