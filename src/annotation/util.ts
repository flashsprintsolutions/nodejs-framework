import { getContainer } from '../declarations/cache-config';
import { loadInContainer } from '../declarations/global-container';
import { Util } from '../declarations/util';
import { Dependency } from '../declarations/dependency';
import { processClassConfig } from '../common/class-config';

export function util<
  T extends new() => Util
>(config: { dependency?: Array<new () => Dependency>; isSingleton?: boolean; } = {}): (Target: T) => void {
  return function decorator(Target: T): void {
    const _config = processClassConfig(config);
    loadInContainer(getContainer('util'), Target, { isSingleton: config.isSingleton });
    Object.assign(Target, { classId: _config.classId });
  };
}
