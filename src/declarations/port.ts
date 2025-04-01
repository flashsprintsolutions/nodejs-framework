import { Container, injectable, interfaces } from 'inversify';
import { Base } from './base';
import { getConfig, getContainer } from './cache-config';
import { SDK } from './s-d-k';
import { Util } from './util';
import { Dependency } from './dependency';

type ServiceIdentifier<T> = interfaces.ServiceIdentifier<T>;

@injectable()
export class Port<S extends SDK> extends Base {
  sdkType: S;

  protected sdk: S;

  constructor() {
    super();
    const { classId } = (this.constructor as { classId?: string });
    if (classId) {
      const externalServiceConfig = getConfig((this.constructor as { classId?: string }).classId) as {
        sdk: new() => SDK;
        sdkContainer: Container;
      };
      this.sdk = externalServiceConfig.sdkContainer.get<S>(externalServiceConfig.sdk);
    }
  }

  protected getUtil<T extends Util>(UtilClass: ServiceIdentifier<T>): T {
    return getContainer('util').get(UtilClass);
  }

  protected getDependency<T extends Dependency>(DependencyClass: ServiceIdentifier<T>): T {
    return (getConfig((this.constructor as { classId?: string }).classId) as { dependency: Container }).dependency.get<T>(DependencyClass);
  }
}
