import { getContainer, setConfig } from '../declarations/cache-config';
import { loadInContainer } from '../declarations/global-container';

export function db<T extends new() => unknown>(): (Target: T) => void {
  return function decorator(Target: T): void {
    loadInContainer(getContainer('db'), Target);
    Object.assign(Target, { classId: setConfig({}) });
  };
}
