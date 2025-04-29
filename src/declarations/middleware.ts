import {
  NextFunction, Request, RequestHandler, Response,
} from 'express';
import { injectable } from 'inversify';
import { ServiceIdentifier } from '@inversifyjs/common';
import { Base } from './base';
import { getContainer } from './cache-config';
import { Repository } from './repository';
import { Service } from './service';

@injectable()
export abstract class Middleware extends Base {
  protected getRepository<T extends Repository>(RepositoryClass: ServiceIdentifier<T>): T {
    return getContainer('repository').get(RepositoryClass);
  }

  protected getService<R extends Repository, T extends Service<R>>(ServiceClass: ServiceIdentifier<T>): T {
    return getContainer('service').get<T>(ServiceClass);
  }

  error(error: Error & { code?: number; }, _req: Request, res: Response, _next: NextFunction): void {
    res.status(error.code || 400).send(error.stack || error.message);
  }

  abstract handler(req: Request): Promise<void>;

  get build(): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        this.handler(req)
          // eslint-disable-next-line promise/no-callback-in-promise
          .then(() => next())
          .catch((error) => this.error(error as Error, req, res, next));
      } catch (error) {
        this.error(error as Error, req, res, next);
      }
    };
  }
}
