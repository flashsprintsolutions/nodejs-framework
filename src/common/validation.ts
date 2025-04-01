import { interfaces } from 'inversify';

type ServiceIdentifier<T> = interfaces.ServiceIdentifier<T>;

function isAbstractPrototype(prototype: unknown): boolean {
  const propertyNames = Object.getOwnPropertyNames(prototype);
  return propertyNames.every((propertyName) => {
    const propertyDescriptor = Object.getOwnPropertyDescriptor(prototype, propertyName);
    const isMethod = propertyDescriptor && typeof propertyDescriptor.value === 'function';
    const isAbstractMethod = isMethod && propertyDescriptor.value === undefined;

    // Ensure it's either a constructor or an abstract method, and no other properties exist
    return propertyName === 'constructor' || isAbstractMethod;
  });
}

export function isAbstractClassWithOnlyAbstractMethods(cls: ServiceIdentifier<unknown> & { prototype?: unknown }): boolean {
  return isAbstractPrototype(cls.prototype) && isAbstractPrototype(new (cls as new() => unknown)());
}
