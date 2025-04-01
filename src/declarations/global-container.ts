import 'reflect-metadata';
import { Container, injectable } from 'inversify';
import { ServiceIdentifier } from '@inversifyjs/common';
import { setContainer } from './cache-config';

const serviceContainer = new Container();
const middlewareContainer = new Container();
const routeContainer = new Container();
const sdkContainer = new Container();
const repositoryContainer = new Container();
const utilContainer = new Container();
const dbContainer = new Container();

setContainer('service', serviceContainer);
setContainer('middleware', middlewareContainer);
setContainer('route', routeContainer);
setContainer('adapter', sdkContainer);
setContainer('repository', repositoryContainer);
setContainer('util', utilContainer);
setContainer('db', dbContainer);

function loadInContainer<T>(
  container: Container,
  target: new () => T,
  config: { isSingleton: boolean } = { isSingleton: true },
  bind: ServiceIdentifier<unknown> = target,
): void {
  if (!target) {
    return;
  }
  if (!Reflect.hasOwnMetadata('inversify:paramtypes', target)) {
    injectable()(target);
  }
  if (config.isSingleton === undefined) {
    Object.assign(config, { isSingleton: true });
  }
  if (config.isSingleton) {
    container.bind(bind).to(target).inSingletonScope();
  } else {
    container.bind(bind).to(target);
  }
}

export { loadInContainer, serviceContainer, middlewareContainer };
