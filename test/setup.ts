import { App } from './application/app';
import { createStorage, deleteStorage } from './application/visit-count';

afterAll(() => {
  const app = App.getServer();
  app.close();
});

beforeEach(() => {
  createStorage();
});

afterEach(() => {
  deleteStorage();
});
