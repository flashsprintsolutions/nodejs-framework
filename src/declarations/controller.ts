import { injectable, interfaces } from 'inversify';
import { Base } from './base';
import { getContainer } from './cache-config';
import { Service } from './service';
import { Util } from './util';
import { Repository } from './repository';

type ServiceIdentifier<T> = interfaces.ServiceIdentifier<T>;

@injectable()
export class Controller extends Base {
  protected getService<R extends Repository, T extends Service<R>>(ServiceClass: ServiceIdentifier<T>): T {
    return getContainer('service').get<T>(ServiceClass);
  }

  protected getUtil<T extends Util>(UtilClass: ServiceIdentifier<T>): T {
    return getContainer('util').get<T>(UtilClass);
  }
}
