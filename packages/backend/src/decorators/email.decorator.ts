import { createParamDecorator, ExecutionContext } from '@nestjs/common';

const Email = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});

export default Email;
