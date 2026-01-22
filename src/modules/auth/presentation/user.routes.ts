import { Router } from 'express';
import { check } from 'express-validator';
import { UserController } from './user.controller';
import { MongoUserRepository } from '../infrastructure/mongo-user.repository';
import { validateFields } from '../../../shared/http/validate-fields';
import { AuthMiddleware } from '../../../shared/http/auth.middleware';
import { RoleMiddleware } from '../../../shared/http/role.middleware';

export class UserRoutes {
    static get routes(): Router {
        const router = Router();
        const repository = new MongoUserRepository();
        const controller = new UserController(repository);

        // Get all users - ADMIN or VENDEDOR
        router.get(
            '/',
            [
                AuthMiddleware.validateJWT,
                RoleMiddleware(['ADMIN', 'VENDEDOR']),
            ],
            controller.getUsers
        );

        // Update user - ADMIN only
        router.put(
            '/:id',
            [
                AuthMiddleware.validateJWT,
                RoleMiddleware(['ADMIN']),
                check('id', 'Invalid ID').isMongoId(),
                validateFields,
            ],
            controller.updateUser
        );

        // Delete user (Soft Delete) - ADMIN only
        router.delete(
            '/:id',
            [
                AuthMiddleware.validateJWT,
                RoleMiddleware(['ADMIN']),
                check('id', 'Invalid ID').isMongoId(),
                validateFields,
            ],
            controller.deleteUser
        );

        return router;
    }
}
