import 'dotenv/config';

export const envs = {
    PORT: parseInt(process.env.PORT || '8080'),
    MONGO_URI: process.env.MONGO_URI || '',
    JWT_SECRET: process.env.JWT_SECRET || 'default_secret_please_change',
};

if (!envs.MONGO_URI) {
    throw new Error('MONGO_URI is not defined in environment variables');
}
