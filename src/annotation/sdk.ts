import { SDK } from '../declarations/s-d-k';
import { Dependency } from '../declarations/dependency';
import { processClassConfig } from '../common/class-config';

export function sdk<
  T extends new() => SDK,
>(config: { dependency?: Array<new () => Dependency>; } = {}): (Target: T) => void {
  return function decorator(Target: T): void {
    const _config = processClassConfig(config);
    Object.assign(Target, { classId: _config.classId });
  };
}
