import { UserRepository } from '../domain/user.repository';
import { AuthService } from './auth.service';
import { AppError } from '../../../shared/core/AppError';
import { UseCase } from '../../../shared/core/UseCase';

interface LoginUserDto {
    email: string;
    password: string;
}

interface LoginResponse {
    user: {
        id: string;
        name: string;
        email: string;
    };
    token: string;
}

export class LoginUserUseCase implements UseCase<LoginUserDto, LoginResponse> {
    constructor(private readonly userRepository: UserRepository) { }

    async execute(dto: LoginUserDto): Promise<LoginResponse> {
        const user = await this.userRepository.findByEmail(dto.email);
        if (!user) {
            throw AppError.badRequest('Invalid credentials');
        }

        const isMatch = await AuthService.comparePassword(dto.password, user.password!);
        if (!isMatch) {
            throw AppError.badRequest('Invalid credentials');
        }

        const token = AuthService.generateToken({ id: user.id });

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            token,
        };
    }
}
