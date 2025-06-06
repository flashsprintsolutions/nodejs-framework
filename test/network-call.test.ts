import { HttpClient } from './application/http-client';
import { getCallCount } from './application/visit-count';

const httpClient = new HttpClient();

describe('Application', () => {
  describe('Network Call', () => {
    it('Should call the application route1 method', async () => {
      const response = await httpClient.rp({
        method: 'GET',
        uri: 'http://localhost:9000/v1/route1',
        responseJson: true,
      });
      expect(response).toEqual({ status: 'success', data: { success: 'V1ControllerRoute1' } });
      expect(getCallCount()).toEqual({
        V1ControllerRoute1: 1,
        FirstMiddlewareHandler: 1,
      });
    });

    it('Should call the application error route of subRout1 method', async () => {
      const response = await httpClient.rp({
        method: 'GET',
        uri: 'http://localhost:9000/v1/subRoute1/route1',
        responseJson: true,
      });
      expect(response).toEqual({ status: 'success', data: { success: 'Sub1ControllerRoute1' } });
      expect(getCallCount()).toEqual({
        Sub1ControllerRoute1: 1,
        ControllerService1ServiceRoute1Call: 1,
        Service1ServiceDummyCall: 1,
      });
    });

    it('Should call the application route1 of subRout1 method', async () => {
      try {
        await httpClient.rp({
          method: 'GET',
          uri: 'http://localhost:9000/v1/subRoute1/error',
        });
        throw Error('should not reach here.');
      } catch (_error) {
        const error = _error as Error;
        expect(error.message).toEqual('400 - Internal Server error. error triggered');
        expect(getCallCount()).toEqual({ Sub1ControllerError: 1 });
      }
    });

    it('Should fail call when unexpected error occurred in middleware', async () => {
      try {
        await httpClient.rp({
          method: 'GET',
          uri: 'http://localhost:9000/v1/subRoute1/middlewareError',
          responseJson: true,
        });
        throw new Error('should not reach here');
      } catch (_error) {
        const error = _error as Error;
        expect(error.message).toEqual('400 - Internal Server error. unhandled error');
      }
    });

    it('Should fail call the application route1 of subRout1 method when method is invalid', async () => {
      try {
        await httpClient.rp({
          method: 'POST',
          uri: 'http://localhost:9000/v1/subRoute1/route1',
          responseJson: true,
        });
        throw new Error('should not reach here');
      } catch (_error) {
        const error = _error as Error;
        expect(error.message).toEqual('404 - <!DOCTYPE html>\n' +
          '<html lang="en">\n' +
          '<head>\n' +
          '<meta charset="utf-8">\n' +
          '<title>Error</title>\n' +
          '</head>\n' +
          '<body>\n' +
          '<pre>Cannot POST /v1/subRoute1/route1</pre>\n' +
          '</body>\n' +
          '</html>\n');
      }
    });

    it('Should call the application route2 of subRout1 method', async () => {
      const response = await httpClient.rp({
        method: 'POST',
        uri: 'http://localhost:9000/v1/subRoute1/route2',
        body: { body: 'test' },
        responseJson: true,
      });
      expect(response).toEqual({ status: 'failure', data: { class: 'Sub1ControllerRoute2', body: { body: 'test' } } });
      expect(getCallCount()).toEqual({
        Sub1ControllerRoute2: 1,
        ControllerService1ServiceRoute1Call: 1,
        Service2ServiceDummyCall: 1,
      });
    });

    it('Should call the application route2Date of subRout1 method', async () => {
      const response = await httpClient.rp<{
        status: string;
        data: {
          class: string;
          body: {
            date: { __type: string; iso: string; };
            inputDateJson: { __type: string; iso: string; };
            inputString: string;
            inputDate: string;
          };
        };
      }>({
        method: 'POST',
        uri: 'http://localhost:9000/v1/subRoute2/route2/date',
        body: {
          inputString: new Date().toISOString(),
          inputDate: new Date(),
          inputDateJson: { __type: 'Date', iso: new Date().toISOString() },
        },
        responseJson: true,
      });
      expect(response.status).toEqual('success');
      expect(response.data.class).toEqual('Sub2ControllerRoute2Date');
      expect(typeof response.data.body.inputString).toEqual('string');
      expect(typeof response.data.body.inputDate).toEqual('string');
      expect(response.data.body.date.__type).toEqual('Date');
      expect(response.data.body.date.iso).toBeDefined();
      expect(response.data.body.inputDateJson.__type).toEqual('Date');
      expect(response.data.body.inputDateJson.iso).toBeDefined();
      expect(getCallCount()).toEqual({
        Sub2ControllerRoute2Date: 1,
        ControllerService2ServiceRoute1Call: 1,
        Service2ServiceDummyCall: 1,
      });
    });

    it('Should call the application route1 of subRout2 method', async () => {
      const response = await httpClient.rp({
        method: 'DELETE',
        uri: 'http://localhost:9000/v1/subRoute2/route1/id',
        body: { body: 'test' },
        responseJson: true,
      });
      expect(response).toEqual({
        status: 'success',
        data: { success: 'Sub2ControllerRoute1', params: { id: 'id' }, body: { body: 'test' } },
      });
      expect(getCallCount()).toEqual({
        Sub2ControllerRoute1: 1,
        ControllerService2ServiceRoute1Call: 1,
        Service1ServiceDummyCall: 1,
      });
    });

    it('Should call the application route2 of subRout2 method', async () => {
      const response = await httpClient.rp({
        method: 'PUT',
        uri: 'http://localhost:9000/v1/subRoute2/route2',
        body: { body: 'test' },
        responseJson: true,
      });
      expect(response).toEqual({
        status: 'success',
        data: { class: 'Sub2ControllerRoute2', body: { body: 'test' } },
      });
      expect(getCallCount()).toEqual({
        Sub2ControllerRoute2: 1,
        ControllerService2ServiceRoute1Call: 1,
        Service2ServiceDummyCall: 1,
      });
    });
  });
});
