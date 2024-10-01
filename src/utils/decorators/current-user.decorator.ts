import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { User } from '@prisma/client';

export const CurrentUser = createParamDecorator(
    (key: keyof User, context: ExecutionContext) => {
        const req: Request = context.switchToHttp().getRequest();
        const user = req.user;

        return key ? user[key] : user;
    },
);
