import { Container, injectable } from 'inversify';
import { ServiceIdentifier } from '@inversifyjs/common';
import { Base } from './base';
import { getConfig, getContainer } from './cache-config';
import { Service } from './service';
import { Util } from './util';
import { SDK } from './s-d-k';
import { Port } from './port';
import { Repository } from './repository';

@injectable()
export class Dependency<R extends Repository = undefined> extends Base {
  repositoryType: R;

  protected repository: R;

  constructor() {
    super();
    const externalDependencyConfig = getConfig((this.constructor as { classId?: string }).classId) as {
      repository: new() => R;
    };
    if (externalDependencyConfig?.repository) {
      this.repository = getContainer('repository').get<R>(externalDependencyConfig.repository);
    }
  }

  protected getService<R2 extends Repository, T extends Service<R2>>(ServiceClass: ServiceIdentifier<T>): T {
    return getContainer('service').get<T>(ServiceClass);
  }

  protected getAdapter<Z extends SDK, T extends Port<Z>>(AdapterClass: ServiceIdentifier<T>): T {
    return getContainer('adapter').get<T>(AdapterClass);
  }

  protected getUtil<T extends Util>(UtilClass: ServiceIdentifier<T>): T {
    return getContainer('util').get<T>(UtilClass);
  }

  protected getDependency<T extends Dependency<R>>(DependencyClass: ServiceIdentifier<T>): T {
    const { attachedToClassId } = getConfig((this.constructor as { classId?: string }).classId) as { attachedToClassId?: string; };
    if (attachedToClassId) {
      const siblingDependency = (getConfig(attachedToClassId) as { dependency: Container; }).dependency;
      if (siblingDependency.isBound(DependencyClass)) {
        return siblingDependency.get(DependencyClass);
      }
    }
    return (getConfig((this.constructor as { classId?: string }).classId) as { dependency: Container }).dependency.get<T>(DependencyClass);
  }
}
