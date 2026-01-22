import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { envs } from '../../../config/envs';

export class AuthService {
    static async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }

    static async comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

    static generateToken(payload: any): string {
        return jwt.sign(payload, envs.JWT_SECRET, { expiresIn: '2h' });
    }

    static verifyToken(token: string): any {
        return jwt.verify(token, envs.JWT_SECRET);
    }
}
