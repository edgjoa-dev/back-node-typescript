import mongoose from 'mongoose';
import { envs } from '../../config/envs';

export class Database {
    static async connect() {
        try {
            await mongoose.connect(envs.MONGO_URI);
            console.log('Connected to MongoDB');
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
            process.exit(1);
        }
    }

    static async disconnect() {
        await mongoose.disconnect();
    }
}
