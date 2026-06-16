import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ResponseUserDto } from '../../users/dto/response-user.dto';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): ResponseUserDto => {
    const request = ctx.switchToHttp().getRequest<{ user: ResponseUserDto }>();
    return request.user;
  },
);
