/* eslint-disable @typescript-eslint/no-unsafe-argument */
import * as rfdc from 'rfdc';

const deepClone = rfdc.default({ proto: false, circles: false });

function isClassObject<T>(obj: T): boolean {
  if (!obj || typeof obj !== 'object') {
    return false;
  }
  if (!obj.constructor) {
    return false;
  }
  return Object.getPrototypeOf(obj) !== Object.prototype;
}

function cloneInstance<T>(instance: T): T {
  const cloned = Object.create(Object.getPrototypeOf(instance));
  Object.assign(cloned, instance);
  return cloned as T;
}

export function deepCopy<T>(json: T): T {
  if (!isClassObject(json)) {
    return deepClone(json);
  }
  return cloneInstance(json);
}
