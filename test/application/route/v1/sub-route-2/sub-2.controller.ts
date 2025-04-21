import { Request, Response } from 'express';
import { Controller } from '../../../../../src/declarations/controller';
import { controller } from '../../../../../src/annotation/controller';
import { DELETE, PUT } from '../../../../../src/annotation/route-method';
import { incrementCallCount } from '../../../visit-count';
import { ControllerService2Service } from '../../../service/controller-service-2.service';
import { RouteResponse } from '../../../../../src/common/handler';

@controller()
export class Sub2Controller extends Controller {
  private controllerService2Service = this.getService(ControllerService2Service);

  @DELETE('/route1/:id')
  route1(req: Request, res: Response): Promise<RouteResponse> {
    incrementCallCount('Sub2ControllerRoute1');
    this.controllerService2Service.route1Call();
    return Promise.resolve({ response: { success: 'Sub1ControllerRoute1', body: req.body, params: req.params } });
  }

  @PUT('/route2')
  route2(req: Request): Promise<RouteResponse> {
    incrementCallCount('Sub2ControllerRoute2');
    this.controllerService2Service.route2Call();
    return Promise.resolve({
      response: { class: 'Sub2ControllerRoute2', body: req.body },
    });
  }
}
