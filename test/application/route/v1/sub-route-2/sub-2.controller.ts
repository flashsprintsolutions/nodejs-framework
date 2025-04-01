import { Request, Response } from 'express';
import { Controller } from '../../../../../src/declarations/controller';
import { controller } from '../../../../../src/annotation/controller';
import { DELETE, PUT } from '../../../../../src/annotation/route-method';
import { incrementCallCount } from '../../../visit-count';
import { ControllerService2Service } from '../../../service/controller-service-2.service';

@controller()
export class Sub2Controller extends Controller {
  private controllerService2Service = this.getService(ControllerService2Service);

  @DELETE('/route1/:id')
  route1(req: Request, res: Response): Promise<void> {
    incrementCallCount('Sub2ControllerRoute1');
    this.controllerService2Service.route1Call();
    res.json({ success: 'Sub1ControllerRoute1', body: req.body as Record<string, unknown>, params: req.params });
    return Promise.resolve();
  }

  @PUT('/route2')
  route2(req: Request, res: Response): Promise<void> {
    incrementCallCount('Sub2ControllerRoute2');
    this.controllerService2Service.route2Call();
    res.json({ success: 'Sub2ControllerRoute2', body: req.body as Record<string, unknown> });
    return Promise.resolve();
  }
}
