import { ServiceIdentifier } from '@inversifyjs/common';
import { Dependency } from '../declarations/dependency';
import { Repository } from '../declarations/repository';
import { processClassConfig } from '../common/class-config';

export function dependency<
  R extends Repository,
  T extends new() => Dependency<R>,
>(config: { repository?: ServiceIdentifier<R>; dependency?: Array<new () => Dependency<R | undefined>>; } = {}): (Target: T) => void {
  return function decorator(Target: T): void {
    const _config = processClassConfig(config);
    Object.assign(Target, { classId: _config.classId });
  };
}
