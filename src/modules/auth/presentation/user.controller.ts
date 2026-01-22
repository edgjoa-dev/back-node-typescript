import { Request, Response } from 'express';
import { GetUsersUseCase } from '../application/get-users.use-case';
import { UpdateUserUseCase } from '../application/update-user.use-case';
import { DeleteUserUseCase } from '../application/delete-user.use-case';
import { MongoUserRepository } from '../infrastructure/mongo-user.repository';

export class UserController {
    private readonly getUsersUseCase: GetUsersUseCase;
    private readonly updateUserUseCase: UpdateUserUseCase;
    private readonly deleteUserUseCase: DeleteUserUseCase;

    constructor(repository: MongoUserRepository) {
        this.getUsersUseCase = new GetUsersUseCase(repository);
        this.updateUserUseCase = new UpdateUserUseCase(repository);
        this.deleteUserUseCase = new DeleteUserUseCase(repository);
    }

    getUsers = async (req: Request, res: Response) => {
        try {
            const users = await this.getUsersUseCase.execute();
            res.status(200).json({
                total: users.length,
                users,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };

    updateUser = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { name, email, roles } = req.body;
        try {
            await this.updateUserUseCase.execute({ id: id as string, name, email, roles });
            res.json({ message: 'User updated successfully' });
        } catch (error: any) {
            if (error.statusCode) {
                res.status(error.statusCode).json({ error: error.message });
            } else {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    };

    deleteUser = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            await this.deleteUserUseCase.execute(id as string);
            res.json({ message: 'User deleted successfully' });
        } catch (error: any) {
            if (error.statusCode) {
                res.status(error.statusCode).json({ error: error.message });
            } else {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    };
}
