import { Response } from 'express';
import { createResponse, MockResponse as TypeMockResponse } from 'node-mocks-http';

const mockResponse = createResponse;
type MockResponse = TypeMockResponse<Response>;

export { mockResponse };
export type { MockResponse };
