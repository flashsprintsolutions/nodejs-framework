import { Container, injectable, interfaces } from 'inversify';
import { Base } from './base';
import { getConfig, getContainer } from './cache-config';
import { Util } from './util';
import { Dependency } from './dependency';

type ServiceIdentifier<T> = interfaces.ServiceIdentifier<T>;

@injectable()
export class SDK extends Base {
  protected getUtil<T extends Util>(UtilClass: ServiceIdentifier<T>): T {
    return getContainer('util').get(UtilClass);
  }

  protected getDependency<T extends Dependency>(DependencyClass: ServiceIdentifier<T>): T {
    return (getConfig((this.constructor as { classId?: string }).classId) as { dependency: Container }).dependency.get<T>(DependencyClass);
  }
}
