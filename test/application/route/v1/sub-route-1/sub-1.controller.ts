import { Request, Response } from 'express';
import { Controller } from '../../../../../src/declarations/controller';
import { controller } from '../../../../../src/annotation/controller';
import { GET, POST } from '../../../../../src/annotation/route-method';
import { incrementCallCount } from '../../../visit-count';
import { ControllerService1Service } from '../../../service/controller-service-1.service';

@controller()
export class Sub1Controller extends Controller {
  private controllerService1Service = this.getService(ControllerService1Service);

  @GET('/route1')
  route1(req: Request, res: Response): Promise<void> {
    incrementCallCount('Sub1ControllerRoute1');
    this.controllerService1Service.route1Call();
    res.json({ success: 'Sub1ControllerRoute1' });
    return Promise.resolve();
  }

  @POST('/route2')
  route2(req: Request, res: Response): Promise<void> {
    incrementCallCount('Sub1ControllerRoute2');
    this.controllerService1Service.route2Call();
    res.json({ success: 'Sub1ControllerRoute2', body: req.body as Record<string, unknown> });
    return Promise.resolve();
  }
}
