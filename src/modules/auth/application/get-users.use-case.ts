import { UserEntity } from '../domain/user.entity';
import { UserRepository } from '../domain/user.repository';
import { UseCase } from '../../../shared/core/UseCase';

export class GetUsersUseCase implements UseCase<void, UserEntity[]> {
    constructor(private readonly userRepository: UserRepository) { }

    async execute(): Promise<UserEntity[]> {
        return this.userRepository.findAll();
    }
}
