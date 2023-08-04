import { Request } from 'express';
import { createRequest, MockRequest as TypeMockRequest } from 'node-mocks-http';

const mockRequest = createRequest;
type MockRequest = TypeMockRequest<Request>;

export { mockRequest };
export type { MockRequest };
