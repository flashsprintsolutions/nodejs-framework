import { App } from './application/app';
import { createStorage, deleteStorage } from './application/visit-count';

afterAll(() => {
  const server = App.getServer();
  server.close();
});

beforeEach(() => {
  createStorage();
});

afterEach(() => {
  deleteStorage();
});
