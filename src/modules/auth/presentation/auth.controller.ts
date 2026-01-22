import { Request, Response } from 'express';
import { RegisterUserUseCase } from '../application/register-user.use-case';
import { LoginUserUseCase } from '../application/login-user.use-case';
import { MongoUserRepository } from '../infrastructure/mongo-user.repository';

export class AuthController {
    private readonly registerUserUseCase: RegisterUserUseCase;
    private readonly loginUserUseCase: LoginUserUseCase;

    constructor(repository: MongoUserRepository) {
        this.registerUserUseCase = new RegisterUserUseCase(repository);
        this.loginUserUseCase = new LoginUserUseCase(repository);
    }

    register = async (req: Request, res: Response) => {
        try {
            const { name, email, password } = req.body;
            await this.registerUserUseCase.execute({ name, email, password });
            res.status(201).json({ message: 'User registered successfully' });
        } catch (error: any) {
            this.handleError(res, error);
        }
    };

    login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            const result = await this.loginUserUseCase.execute({ email, password });
            res.status(200).json(result);
        } catch (error: any) {
            this.handleError(res, error);
        }
    };

    private handleError(res: Response, error: any) {
        if (error.isOperational) {
            res.status(error.statusCode).json({ error: error.message });
        } else {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}
