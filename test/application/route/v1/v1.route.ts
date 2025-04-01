import { Route } from '../../../../src/declarations/route';
import { route } from '../../../../src/annotation/route';
import { FirstMiddleware } from '../../middleware/first.middleware';
import { V1Controller } from './v1.controller';
import { Sub1Route } from './sub-route-1/sub-1.route';
import { Sub2Route } from './sub-route-2/sub-2.route';

@route({
  subRoutes: [
    { path: '/subRoute1', route: Sub1Route },
    { path: '/subRoute2', route: Sub2Route },
  ],
  controller: V1Controller,
  middleware: [FirstMiddleware],
})
export class V1Route extends Route {}
