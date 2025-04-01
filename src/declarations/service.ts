import { Container, injectable, interfaces } from 'inversify';
import { Base } from './base';
import { getConfig, getContainer } from './cache-config';
import { Port } from './port';
import { Repository } from './repository';
import { SDK } from './s-d-k';
import { Util } from './util';
import { Dependency } from './dependency';

type ServiceIdentifier<T> = interfaces.ServiceIdentifier<T>;

@injectable()
export class Service<R extends Repository = undefined> extends Base {
  repositoryType: R;

  protected repository: R;

  constructor() {
    super();
    const externalServiceConfig = getConfig((this.constructor as { classId?: string }).classId) as {
      repository: new() => R;
    };
    if (externalServiceConfig?.repository) {
      this.repository = getContainer('repository').get<R>(externalServiceConfig.repository);
    }
  }

  protected getAdapter<Z extends SDK, T extends Port<Z>>(AdapterClass: ServiceIdentifier<T>): T {
    return getContainer('adapter').get<T>(AdapterClass);
  }

  protected getService<R2 extends Repository, T extends Service<R2>>(ServiceClass: ServiceIdentifier<T>): T {
    return getContainer('service').get<T>(ServiceClass);
  }

  protected getUtil<T extends Util>(UtilClass: ServiceIdentifier<T>): T {
    return getContainer('util').get<T>(UtilClass);
  }

  protected getDependency<T extends Dependency<R>>(DependencyClass: ServiceIdentifier<T>): T {
    return (getConfig((this.constructor as { classId?: string }).classId) as { dependency: Container }).dependency.get<T>(DependencyClass);
  }
}
