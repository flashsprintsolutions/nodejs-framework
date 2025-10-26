import { Express, Response, Request, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { Application } from '../../src/declarations/application';
import { application } from '../../src/annotation/application';
import { AppRoutes } from './route/app-routes';
import { RouteValidatorMiddleware } from './middleware/route-validator.middleware';
import { incrementCallCount } from './visit-count';

@application({
  ip: '0.0.0.0',
  port: 9000,
  routeCompiler: AppRoutes,
  routeValidator: RouteValidatorMiddleware,
})
class App extends Application {
  beforeRouteRegistration(app: Express): void  {
    app.use((req, res, next) => {
      if (req.path === '/error/route') {
        next(Error('error triggered'));
        return;
      }
      next();
    });
    super.beforeRouteRegistration(app);
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json({ limit: '1MB' }));
  }

  errorHandler(error: Error, _request: Request, response: Response, _nextFunction: NextFunction): void {
    incrementCallCount('errorHandler');
    super.errorHandler(error, _request, response, _nextFunction);
  }
}

const app: Express = App.getApp();

// Expose app
export { app, App };
