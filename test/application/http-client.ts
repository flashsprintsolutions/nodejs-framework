/* eslint-disable */
import fetch, { BodyInit, HeaderInit, Response } from 'node-fetch';

const AllowedMethod = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const;

export type HttpClientAllowedMethod = typeof AllowedMethod[number];

export interface HttpClientCallRequest<T = Record<string, unknown>> {
  method: HttpClientAllowedMethod;
  uri: string;
  headers?: HeaderInit;
  body?: T;
  formData?: Record<string, unknown>;
  responseJson?: boolean;
}

class HttpClient {
  async rp<R = unknown, T = Record<string, unknown>>(request: HttpClientCallRequest<T>): Promise<R> {
    const headers: HeaderInit = {
      'Content-Type': this.getContentType(request),
      ...(request.headers || {}),
    } as HeaderInit;
    if (AllowedMethod.includes(request.method)) {
      return this.customFetch<R>(() => fetch(
        request.uri,
        { method: request.method, body: this.getRequestBody(request), headers }),
      request.responseJson);
    }
    throw Error(`Method "${request.method}" not implemented.`);
  }

  private async transformResponse<R>(response: Response, responseJson: boolean): Promise<R> {
    if (response.status >= 200 && response.status < 300) {
      if (responseJson) {
        return response.json() as R;
      }
      return await response.text() as R;
    }
    const errorMessage = await response.text();
    throw Error(`${response.status} - ${errorMessage}`);
  }

  private async customFetch<R>(
    callback: () => Promise<Response>,
    jsonResponse?: boolean): Promise<R> {
    const response = await callback();
    return this.transformResponse<R>(response, jsonResponse);
  }

  private getContentType<T>(request: HttpClientCallRequest<T>): string {
    if (request.formData) {
      return 'application/x-www-form-urlencoded';
    }
    return 'application/json';
  }

  private getRequestBody<T>(request: HttpClientCallRequest<T>): BodyInit | undefined {
    if (request.formData || request.body) {
      return JSON.stringify(request.formData || request.body);
    }
    return undefined;
  }
}

export { HttpClient };
