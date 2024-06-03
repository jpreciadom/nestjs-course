import { ExecutionContext, InternalServerErrorException, createParamDecorator } from "@nestjs/common";
import { User } from "../entities";

export const GetUser = createParamDecorator((_, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest()
  const user = req.user;

  if (!user)
    throw new InternalServerErrorException('User not found (request)');
  
  return user as User
});