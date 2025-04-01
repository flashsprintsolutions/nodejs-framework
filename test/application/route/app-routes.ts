import { RouteCompiler } from '../../../src/declarations/route-compiler';
import { routeCompiler } from '../../../src/annotation/route-compiler';
import { V1Route } from './v1/v1.route';

@routeCompiler([
  { path: '/v1', route: V1Route },
])
export class AppRoutes extends RouteCompiler {
}
