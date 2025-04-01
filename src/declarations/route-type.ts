import { RequestHandler } from 'express';

export declare type AllowedMethod = 'get' | 'delete' | 'post' | 'put' | undefined;

export class RouteType {
  requestHandler?: Array<RequestHandler>;

  method?: AllowedMethod;

  path: string;

  classMethod: string;

  constructor(data: {
    requestHandler?: Array<RequestHandler>;
    method: AllowedMethod;
    path: string;
    classMethod: string;
  }) {
    this.path = data.path;
    this.classMethod = data.classMethod;
    this.method = data.method;
    this.requestHandler = data.requestHandler;
  }

  setPath(path: string): void {
    this.path = path;
  }
}
