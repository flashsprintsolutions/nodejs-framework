import { ServiceIdentifier } from '@inversifyjs/common';
import { getContainer } from '../declarations/cache-config';
import { loadInContainer } from '../declarations/global-container';
import { Repository } from '../declarations/repository';
import { Service } from '../declarations/service';
import { Dependency } from '../declarations/dependency';
import { processClassConfig } from '../common/class-config';

export function service<
  R extends Repository,
  T extends new() => Service<R>
>(config: {
  repository?: ServiceIdentifier<R>;
  dependency?: Array<new () => Dependency<R>>;
  isSingleton?: boolean;
} = {}): (Target: T) => void {
  return function decorator(Target: T): void {
    const _config = processClassConfig(config);
    loadInContainer(getContainer('service'), Target, { isSingleton: config.isSingleton });
    Object.assign(Target, { classId: _config.classId });
  };
}
