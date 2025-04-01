import { Express } from 'express';
import { Application } from '../../src/declarations/application';
import { application } from '../../src/annotation/application';
import { AppRoutes } from './route/app-routes';

@application({
  ip: '0.0.0.0',
  port: 9000,
  routeCompiler: AppRoutes,
})
class App extends Application {
}

const app: Express = App.getApp();

// Expose app
export { app, App };
