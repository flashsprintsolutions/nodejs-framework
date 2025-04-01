import { Container } from 'inversify';
import { getConfig, setConfig } from '../declarations/cache-config';
import { loadInContainer } from '../declarations/global-container';
import { Dependency } from '../declarations/dependency';
import { Repository } from '../declarations/repository';

export function processClassConfig<
  R extends Repository,
  T extends { dependency?: Array<new() => Dependency<R>> },
>(
  _config: T): T & { classId: string; dependency: Container; } {
  const config = {
    ..._config,
    classId: '',
    dependency: new Container(),
  };
  config.classId = setConfig(config);
  (_config.dependency || []).forEach((eachDependency) => {
    const dependencyConfig = getConfig((eachDependency as unknown as { classId: string }).classId) as {
      classId: string;
      attachedToClassId: string;
    };
    if (dependencyConfig.attachedToClassId) {
      throw Error(`${eachDependency.name} is already attached to multiple classes.`);
    }
    dependencyConfig.attachedToClassId = config.classId;
    loadInContainer(config.dependency, eachDependency);
  });
  return config;
}
