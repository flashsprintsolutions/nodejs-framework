import { Container } from 'inversify';
import { v4 as uuid } from 'uuid';

const containerConfig: Record<string, Container> = {};
const cacheConfig: Record<string, Record<string, unknown>> = {};

function setContainer(containerName: string, container: Container): void {
  containerConfig[containerName] = container;
}

function getContainer(containerName: string): Container {
  return containerConfig[containerName];
}

function setConfig(config: { [key: string]: unknown }): string {
  const id = uuid();
  cacheConfig[id] = { ...config, classId: id };
  return id;
}

function getConfig(id: string): { [key: string]: unknown } {
  return cacheConfig[id];
}

export {
  setContainer, getContainer, setConfig, getConfig,
};
