import { ServiceIdentifier } from '@inversifyjs/common';
import { v4 as uuid } from 'uuid';
import { isAbstractClassWithOnlyAbstractMethods } from '../common/validation';
import { Port } from '../declarations/port';
import { SDK } from '../declarations/s-d-k';

export function port<
  T extends SDK,
  Z extends ServiceIdentifier<Port<T>>
>(): (Target: Z) => void {
  return function decorator(Target: Z): void {
    const isAbstractOnly = isAbstractClassWithOnlyAbstractMethods(Target);
    if (!isAbstractOnly) {
      throw Error(`Port should have only abstract functions. ${(Target as unknown as { name: string; }).name}`);
    }
    Object.assign(Target, { portId: uuid() });
  };
}
