import { isAbstractClassWithOnlyAbstractMethods } from './validation';

describe('isAbstractClassWithOnlyAbstractMethods', () => {
  it('should return true for class with only abstract functions', (): void => {
    abstract class ABC {
            abstract function1(): void;

            abstract function2(): void;
    }
    expect(isAbstractClassWithOnlyAbstractMethods(ABC)).toBeTruthy();
  });

  it('should return false for class has variables', (): void => {
    abstract class ABC {
      variable1 = 'string';

            abstract function1(): void;

            abstract function2(): void;
    }
    expect(isAbstractClassWithOnlyAbstractMethods(ABC)).toBeFalsy();
  });

  it('should return false for class has non abstract function', (): void => {
    abstract class ABC {
            abstract function1(): void;

            abstract function2(): void;

            function3(): void {}
    }
    expect(isAbstractClassWithOnlyAbstractMethods(ABC)).toBeFalsy();
  });
});
