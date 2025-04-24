import { Controller } from '../../../../src/declarations/controller';
import { controller } from '../../../../src/annotation/controller';
import { GET } from '../../../../src/annotation/route-method';
import { Request } from 'express';
import { RouteResponse } from '../../../../src/common/handler';
import { incrementCallCount } from '../../visit-count';

@controller()
export class V1Controller extends Controller {
  @GET('/route1')
  route1(req: Request): Promise<RouteResponse<{ success: string; }>> {
    incrementCallCount('V1ControllerRoute1');
    return Promise.resolve({ response: { success: 'V1ControllerRoute1' } });
  }
}
