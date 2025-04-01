import {
  NextFunction, Request, RequestHandler, Response,
} from 'express';
import { injectable, interfaces } from 'inversify';
import { Base } from './base';
import { getContainer } from './cache-config';
import { Repository } from './repository';

type ServiceIdentifier<T> = interfaces.ServiceIdentifier<T>;

@injectable()
export abstract class Middleware extends Base {
  protected getRepository<T extends Repository>(RepositoryClass: ServiceIdentifier<T>): T {
    return getContainer('repository').get(RepositoryClass);
  }

  error(error: Error & { code?: number; }, _req: Request, res: Response, _next: NextFunction): void {
    res.status(error.code || 400).send(error.stack || error.message);
  }

  abstract handler(req: Request): Promise<void>;

  get build(): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        this.handler(req)
          .then(() => next())
          .catch((error) => this.error(error as Error, req, res, next));
      } catch (error) {
        this.error(error as Error, req, res, next);
      }
    };
  }
}
