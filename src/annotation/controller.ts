import { setConfig } from '../declarations/cache-config';
import { Controller } from '../declarations/controller';

export function controller<T extends new() => Controller>(): (Target: T) => void {
  return function decorator(Target: T): void {
    Object.assign(Target, { classId: setConfig({}) });
  };
}
