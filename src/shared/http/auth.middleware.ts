import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../../modules/auth/application/auth.service';

export const AuthMiddleware = {
    validateJWT: (req: Request, res: Response, next: NextFunction) => {
        const token = req.header('x-token');

        if (!token) {
            return res.status(401).json({
                msg: 'No token provided',
            });
        }

        try {
            const payload = AuthService.verifyToken(token);
            (req as any).user = payload;
            next();
        } catch (error) {
            console.log(error);
            return res.status(401).json({
                msg: 'Invalid token',
            });
        }
    },
};
