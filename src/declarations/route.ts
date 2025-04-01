import { Container, injectable } from 'inversify';
import { Base } from './base';
import { getConfig } from './cache-config';
import { Controller } from './controller';

@injectable()
export class Route<T extends Controller = Controller> extends Base {
  controllerType: T;

  protected controller: T;

  constructor() {
    super();
    const routeConfig = getConfig((this.constructor as { classId?: string }).classId) as {
      controller: new() => Controller;
      container: Container;
    };
    this.controller = routeConfig.container.get<T>(routeConfig.controller);
  }
}
