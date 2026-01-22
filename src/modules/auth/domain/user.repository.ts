import { UserEntity } from './user.entity';

export interface UserRepository {
    save(user: UserEntity): Promise<void>;
    update(user: UserEntity): Promise<void>;
    delete(id: string): Promise<void>;
    findByEmail(email: string): Promise<UserEntity | null>;
    findById(id: string): Promise<UserEntity | null>;
    findAll(): Promise<UserEntity[]>;
}
