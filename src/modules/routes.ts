import { Router } from 'express';
import { AuthRoutes } from './auth/presentation/auth.routes';
import { UserRoutes } from './auth/presentation/user.routes';

export class AppRoutes {
    static get routes(): Router {
        const router = Router();
        router.use('/auth', AuthRoutes.routes);
        router.use('/users', UserRoutes.routes);
        return router;
    }
}
