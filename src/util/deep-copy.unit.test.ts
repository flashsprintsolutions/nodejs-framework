import { deepCopy } from './deep-copy';

describe('JSONService', () => {
  describe('deepCopy', () => {
    it('should return undefined when input is undefined', () => {
      const value = deepCopy(undefined);
      expect(value).toBeUndefined();
    });

    it('should return null when input is null', () => {
      // tslint:disable-next-line:no-null-keyword
      const value = deepCopy(null);
      expect(value).toBeNull();
    });

    it('should deep clone the object', () => {
      const object1: Record<string, unknown> = {
        key1: '1',
        key2: 2,
        key3: ['1', '2'],
        key4: [1, 2],
        key5: {
          subKey1: '1',
          subKey2: 2,
          subKey3: new Date(0),
        },
        key6: new Date(0),
        key7: [{
          subKey1: '1',
          subKey2: 2,
          subKey3: new Date(0),
        }],
      };
      const object2 = deepCopy(object1);
      // Object1 Changes
      object1.key0 = 'newKey';
      delete (object1.key5 as Record<string, unknown>).subKey1;
      (object1.key5 as Record<string, unknown>).subKey4 = 'newKey4';
      delete (object1.key7 as Array<Record<string, unknown>>)[0].subKey1;
      (object1.key7 as Array<Record<string, unknown>>)[0].subKey4 = 'newKey4';

      // Object2 changes
      object2.key0 = 'newKeyInObject2';
      expect(object1).toEqual({
        key0: 'newKey',
        key1: '1',
        key2: 2,
        key3: ['1', '2'],
        key4: [1, 2],
        key5: {
          subKey2: 2,
          subKey3: new Date(0),
          subKey4: 'newKey4',
        },
        key6: new Date(0),
        key7: [{
          subKey2: 2,
          subKey3: new Date(0),
          subKey4: 'newKey4',
        }],
      });
      expect(object2).toEqual({
        key0: 'newKeyInObject2',
        key1: '1',
        key2: 2,
        key3: ['1', '2'],
        key4: [1, 2],
        key5: {
          subKey1: '1',
          subKey2: 2,
          subKey3: new Date(0),
        },
        key6: new Date(0),
        key7: [{
          subKey1: '1',
          subKey2: 2,
          subKey3: new Date(0),
        }],
      });
    });

    it('should deep clone the object with undefined fields', () => {
      const object1: Record<string, unknown> = {
        key1: undefined,
        key2: 2,
        key3: ['1', '2', undefined],
        key4: [1, 2, undefined],
        key5: {
          subKey1: '1',
          subKey2: 2,
          subKey3: new Date(0),
        },
        key6: new Date(0),
        key7: [{
          subKey1: '1',
          subKey2: undefined,
          subKey3: new Date(0),
        }],
      };
      const object2 = deepCopy(object1);
      expect(object1).toEqual(object2);
    });

    it('should deep copy class object', () => {
      class Temp {
        value: number = 1;
      }
      const object1 = new Temp();
      object1.value = 2;
      const object2 = deepCopy(object1);
      expect(object1.value).toBe(2);
      expect(object2.value).toBe(2);
      object2.value = 3;
      expect(object1.value).toBe(2);
      expect(object2.value).toBe(3);
    });
  });
});
