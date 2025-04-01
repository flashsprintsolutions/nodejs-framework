import { Service } from '../../../src/declarations/service';
import { service } from '../../../src/annotation/service';
import { incrementCallCount } from '../visit-count';

@service()
export class Service2Service extends Service {
  dummyCall(): void {
    incrementCallCount('Service2ServiceDummyCall');
  }
}
