import { Container } from 'inversify';
import { getContainer } from '../declarations/cache-config';
import { loadInContainer } from '../declarations/global-container';
import { Port } from '../declarations/port';
import { SDK } from '../declarations/s-d-k';
import { Dependency } from '../declarations/dependency';
import { processClassConfig } from '../common/class-config';

export function adapter<
  T extends SDK,
  Z extends(new() => Port<T>)
>(
  sdk: new() => InstanceType<Z>['sdkType'],
  config: { dependency?: Array<new () => Dependency>; isSingletonSDK?: boolean; isSingleton?: boolean } = {}): (Target: Z) => void {
  return function decorator(Target: Z): void {
    const { portId } = (Target as { portId?: string });
    if (!portId) {
      throw Error(`Adapter port is not registered. "${Target.name}"`);
    }
    const _config = processClassConfig({ ...config, sdk, sdkContainer: new Container() });
    loadInContainer(getContainer('adapter'), Target, { isSingleton: config.isSingleton });
    loadInContainer(_config.sdkContainer, sdk, { isSingleton: config.isSingletonSDK });
    Object.assign(Target, { classId: _config.classId });
  };
}
