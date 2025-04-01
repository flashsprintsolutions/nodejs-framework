import { injectable } from 'inversify';

@injectable()
class Base {
  private readonly classType: string;
}

export { Base };
