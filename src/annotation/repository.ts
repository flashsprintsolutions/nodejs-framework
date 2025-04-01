import { ServiceIdentifier } from '@inversifyjs/common';
import { getContainer } from '../declarations/cache-config';
import { loadInContainer } from '../declarations/global-container';
import { Repository } from '../declarations/repository';
import { Dependency } from '../declarations/dependency';
import { processClassConfig } from '../common/class-config';

export function repository<
  T extends new() => Repository
>(BindTo: ServiceIdentifier<Repository>, config: { dependency?: Array<new () => Dependency<InstanceType<T>>>; } = {}): (Target: T) => void {
  return function decorator(Target: T): void {
    const _config = processClassConfig(config);
    loadInContainer(getContainer('repository'), Target, { isSingleton: true }, BindTo);
    Object.assign(Target, { classId: _config.classId });
  };
}
