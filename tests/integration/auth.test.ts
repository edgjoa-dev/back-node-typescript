import request from 'supertest';
import mongoose from 'mongoose';
import { App } from '../../src/app';
import { AppRoutes } from '../../src/modules/routes';
import { envs } from '../../src/config/envs';

let app: any;

beforeAll(async () => {
    // Note: connecting to real DB as per instructions, but normally should use test DB
    await mongoose.connect(envs.MONGO_URI);
    const application = new App({
        port: 8081,
        routes: AppRoutes.routes,
    });
    app = application.app;
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Auth Routes', () => {
    const testUser = {
        name: 'Test Userv2',
        email: 'testv2@example.com',
        password: 'password123'
    };

    beforeEach(async () => {
        // Cleanup test user if exists
        await mongoose.connection.collection('users').deleteMany({ email: testUser.email });
    });

    it('should register a new user', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send(testUser);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('User registered successfully');
    });

    it('should login an existing user', async () => {
        await request(app).post('/api/auth/register').send(testUser);

        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: testUser.email,
                password: testUser.password
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
        expect(response.body.user.email).toBe(testUser.email);
    });
});
