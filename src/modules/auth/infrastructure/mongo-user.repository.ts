import { UserEntity } from '../domain/user.entity';
import { UserRepository } from '../domain/user.repository';
import { UserModel } from './user.schema';

export class MongoUserRepository implements UserRepository {
    async save(user: UserEntity): Promise<void> {
        const { id, ...data } = user;
        // If id exists and is valid, we might want to update or insert. 
        // For registration, we usually let Mongo generate the ID or use the one provided if we are careful.
        // Here, for simplicity, we assume new user creation mainly.
        // If we want to support update, we should use findOneAndUpdate or similar.
        // But saving a NEW user from Entity -> Model:
        const newUser = new UserModel(data);
        await newUser.save();
        // Update the entity with the new ID? 
        // Ideally domain entity should be returned with the ID. 
        // For now, let's keep it void or return the entity. Interface said void.
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        const user = await UserModel.findOne({ email });
        if (!user) return null;
        return this.mapToEntity(user);
    }

    async findById(id: string): Promise<UserEntity | null> {
        const user = await UserModel.findById(id);
        if (!user) return null;
        return this.mapToEntity(user);
    }

    async findAll(): Promise<UserEntity[]> {
        const users = await UserModel.find({ status: true });
        return users.map(user => this.mapToEntity(user));
    }

    async update(user: UserEntity): Promise<void> {
        await UserModel.findByIdAndUpdate(user.id, user);
    }

    async delete(id: string): Promise<void> {
        await UserModel.findByIdAndUpdate(id, { status: false });
    }

    private mapToEntity(user: any): UserEntity {
        return new UserEntity(user.id, user.name, user.email, user.password, user.roles, user.status);
    }
}
