import { Router } from 'express';
import { check } from 'express-validator';
import { AuthController } from './auth.controller';
import { MongoUserRepository } from '../infrastructure/mongo-user.repository';
import { validateFields } from '../../../shared/http/validate-fields';

export class AuthRoutes {
    static get routes(): Router {
        const router = Router();
        const repository = new MongoUserRepository();
        const controller = new AuthController(repository);

        router.post(
            '/register',
            [
                check('name', 'Name is required').not().isEmpty(),
                check('email', 'Email is required').isEmail(),
                check('password', 'Password must be 6+ characters').isLength({ min: 6 }),
                validateFields,
            ],
            controller.register
        );

        router.post(
            '/login',
            [
                check('email', 'Email is required').isEmail(),
                check('password', 'Password is required').not().isEmpty(),
                validateFields,
            ],
            controller.login
        );

        return router;
    }
}
