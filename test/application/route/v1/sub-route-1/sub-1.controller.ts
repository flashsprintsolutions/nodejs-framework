import { Request } from 'express';
import { Controller } from '../../../../../src/declarations/controller';
import { controller } from '../../../../../src/annotation/controller';
import { GET, POST } from '../../../../../src/annotation/route-method';
import { incrementCallCount } from '../../../visit-count';
import { ControllerService1Service } from '../../../service/controller-service-1.service';
import { RouteResponse } from '../../../../../src/common/handler';
import { ErrorMiddleware } from '../../../middleware/error.middleware';

@controller()
export class Sub1Controller extends Controller {
  private controllerService1Service = this.getService(ControllerService1Service);

  @GET('/middlewareError', { middleware: [ErrorMiddleware] })
  middlewareError(_req: Request): Promise<RouteResponse<{ success: string; }>> {
    incrementCallCount('Sub1ControllerError');
    throw Error('error triggered');
  }

  @GET('/error')
  error(_req: Request): Promise<RouteResponse<{ success: string; }>> {
    incrementCallCount('Sub1ControllerError');
    throw Error('error triggered');
  }

  @GET('/route1')
  route1(_req: Request): Promise<RouteResponse<{ success: string; }>> {
    incrementCallCount('Sub1ControllerRoute1');
    this.controllerService1Service.route1Call();
    return Promise.resolve({ response: { success: 'Sub1ControllerRoute1' } });
  }

  @POST('/route2')
  route2(req: Request): Promise<RouteResponse<{ class: string; body: unknown; }>> {
    incrementCallCount('Sub1ControllerRoute2');
    this.controllerService1Service.route2Call();
    return Promise.resolve({
      status: 'failure',
      response: { class: 'Sub1ControllerRoute2', body: req.body },
    });
  }
}
