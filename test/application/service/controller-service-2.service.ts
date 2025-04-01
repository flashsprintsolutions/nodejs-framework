import { Service } from '../../../src/declarations/service';
import { service } from '../../../src/annotation/service';
import { incrementCallCount } from '../visit-count';
import { Service1Service } from './service-1.service';
import { Service2Service } from './service-2.service';

@service()
export class ControllerService2Service extends Service {
  private service1Service = this.getService(Service1Service);
  private service2Service = this.getService(Service2Service);

  route1Call(): void {
    incrementCallCount('ControllerService2ServiceRoute1Call');
    this.service1Service.dummyCall();
  }

  route2Call(): void {
    incrementCallCount('ControllerService2ServiceRoute1Call');
    this.service2Service.dummyCall();
  }
}
