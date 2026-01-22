import { UserRepository } from '../domain/user.repository';
import { UseCase } from '../../../shared/core/UseCase';
import { AppError } from '../../../shared/core/AppError';

export class DeleteUserUseCase implements UseCase<string, void> {
    constructor(private readonly userRepository: UserRepository) { }

    async execute(id: string): Promise<void> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw AppError.notFound('User not found');
        }

        await this.userRepository.delete(id);
    }
}
