import { Container, injectable } from 'inversify';
import { ServiceIdentifier } from '@inversifyjs/common';
import { Base } from './base';
import { getConfig, getContainer } from './cache-config';
import { Util } from './util';
import { Dependency } from './dependency';

@injectable()
export class Repository extends Base {
  protected getDB<T>(DBClass: ServiceIdentifier<T>): T {
    return getContainer('db').get(DBClass);
  }

  protected getUtil<T extends Util>(UtilClass: ServiceIdentifier<T>): T {
    return getContainer('util').get(UtilClass);
  }

  protected getDependency<T extends Dependency>(DependencyClass: ServiceIdentifier<T>): T {
    return (getConfig((this.constructor as { classId?: string }).classId) as { dependency: Container }).dependency.get<T>(DependencyClass);
  }
}
