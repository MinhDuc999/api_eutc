import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../entities/jwt-payload.interface';

//Tạo custom decorator để lấy thông tin user hiện tại từ request
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user?: JwtPayload }>();
    return request.user;
  },
);
