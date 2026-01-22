import { NextFunction, Request, Response } from 'express';
import { MongoUserRepository } from '../../modules/auth/infrastructure/mongo-user.repository';

export const RoleMiddleware = (validRoles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (!(req as any).user) {
            return res.status(500).json({
                msg: 'Server error: verify token first',
            });
        }

        const repository = new MongoUserRepository();
        const user = await repository.findById((req as any).user.id);

        if (!user) {
            return res.status(401).json({
                msg: 'User not found',
            });
        }

        // Check if user has at least one of the valid roles
        const hasRole = user.roles.some((role) => validRoles.includes(role));

        if (!hasRole) {
            return res.status(403).json({
                msg: `User needs one of these roles: ${validRoles}`,
            });
        }

        next();
    };
};
