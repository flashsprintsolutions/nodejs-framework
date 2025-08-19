import { Express } from 'express';
import bodyParser from 'body-parser';
import { Application } from '../../src/declarations/application';
import { application } from '../../src/annotation/application';
import { AppRoutes } from './route/app-routes';
import { RouteValidatorMiddleware } from './middleware/route-validator.middleware';

@application({
  ip: '0.0.0.0',
  port: 9000,
  routeCompiler: AppRoutes,
  routeValidator: RouteValidatorMiddleware,
})
class App extends Application {
  beforeRouteRegistration(app: Express): void  {
    super.beforeRouteRegistration(app);
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json({ limit: '1MB' }));
  }
}

const app: Express = App.getApp();

// Expose app
export { app, App };
