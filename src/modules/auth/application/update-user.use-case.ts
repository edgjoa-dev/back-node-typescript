import { UserEntity } from '../domain/user.entity';
import { UserRepository } from '../domain/user.repository';
import { UseCase } from '../../../shared/core/UseCase';
import { AppError } from '../../../shared/core/AppError';

interface UpdateUserDto {
    id: string;
    name?: string;
    email?: string;
    roles?: string[];
}

export class UpdateUserUseCase implements UseCase<UpdateUserDto, void> {
    constructor(private readonly userRepository: UserRepository) { }

    async execute(dto: UpdateUserDto): Promise<void> {
        const user = await this.userRepository.findById(dto.id);
        if (!user) {
            throw AppError.notFound('User not found');
        }

        if (dto.name) user.name = dto.name;
        if (dto.email) user.email = dto.email; // TODO: Check if email is taken if changed
        if (dto.roles) user.roles = dto.roles;

        await this.userRepository.update(user);
    }
}
