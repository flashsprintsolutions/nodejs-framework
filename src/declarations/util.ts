import { Container, injectable } from 'inversify';
import { ServiceIdentifier } from '@inversifyjs/common';
import { Base } from './base';
import { getConfig, getContainer } from './cache-config';
import { Dependency } from './dependency';

@injectable()
export class Util extends Base {
  protected getUtil<T extends new() => Util>(ServiceClass: T): InstanceType<T> {
    return getContainer('util').get<InstanceType<T>>(ServiceClass);
  }

  protected getDependency<T extends Dependency>(DependencyClass: ServiceIdentifier<T>): T {
    return (getConfig((this.constructor as { classId?: string }).classId) as { dependency: Container }).dependency.get<T>(DependencyClass);
  }
}
