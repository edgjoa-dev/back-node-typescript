import { UserEntity } from '../domain/user.entity';
import { UserRepository } from '../domain/user.repository';
import { AuthService } from './auth.service';
import { AppError } from '../../../shared/core/AppError';
import { UseCase } from '../../../shared/core/UseCase';

interface RegisterUserDto {
    name: string;
    email: string;
    password: string;
}

export class RegisterUserUseCase implements UseCase<RegisterUserDto, void> {
    constructor(private readonly userRepository: UserRepository) { }

    async execute(dto: RegisterUserDto): Promise<void> {
        const userExists = await this.userRepository.findByEmail(dto.email);
        if (userExists) {
            throw AppError.badRequest('User already exists');
        }

        const hashedPassword = await AuthService.hashPassword(dto.password);
        const newUser = new UserEntity('', dto.name, dto.email, hashedPassword);

        await this.userRepository.save(newUser);
    }
}
