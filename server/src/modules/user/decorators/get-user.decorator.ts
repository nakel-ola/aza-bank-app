import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.getArgByIndex(2).req;
    if (data) {
      return request.user[data];
    }

    return request?.user;
  },
);
