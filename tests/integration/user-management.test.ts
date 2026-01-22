import request from 'supertest';
import mongoose from 'mongoose';
import { App } from '../../src/app';
import { AppRoutes } from '../../src/modules/routes';
import { envs } from '../../src/config/envs';
import { AuthService } from '../../src/modules/auth/application/auth.service';

let app: any;
let adminToken: string = '';
let clientToken: string = '';
let userId: string;

beforeAll(async () => {
    await mongoose.connect(envs.MONGO_URI);
    const application = new App({
        port: 8082,
        routes: AppRoutes.routes,
    });
    app = application.app;
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('User Management Routes', () => {
    const testUser = {
        name: 'User To Delete',
        email: 'todelete@example.com',
        password: 'password123',
        roles: ['CLIENT']
    };

    beforeEach(async () => {
        await mongoose.connection.collection('users').deleteMany({});

        // 1. Create User To Delete (Client role by default or forced)
        await request(app).post('/api/auth/register').send(testUser);
        const userToDelete = await mongoose.connection.collection('users').findOne({ email: testUser.email });
        userId = userToDelete!._id.toString();

        // Force Update roles for userToDelete to ensure it is a CLIENT and active
        await mongoose.connection.collection('users').updateOne(
            { _id: userToDelete?._id },
            { $set: { roles: ['CLIENT'], status: true } }
        );

        // 2. Create Admin User
        const adminUser = {
            name: 'Admin User',
            email: 'admin@test.com',
            password: 'password123',
            roles: ['ADMIN']
        };
        const hashedAdminPwd = await AuthService.hashPassword(adminUser.password);
        const adminRes = await mongoose.connection.collection('users').insertOne({
            ...adminUser,
            password: hashedAdminPwd,
            status: true
        });
        adminToken = AuthService.generateToken({ id: adminRes.insertedId.toString() });

        // 3. Create another Client User for clientToken
        const clientUser = {
            name: 'Another Client',
            email: 'client@test.com',
            password: 'password123',
            roles: ['CLIENT']
        };
        const hashedClientPwd = await AuthService.hashPassword(clientUser.password);
        const clientRes = await mongoose.connection.collection('users').insertOne({
            ...clientUser,
            password: hashedClientPwd,
            status: true
        });
        clientToken = AuthService.generateToken({ id: clientRes.insertedId.toString() });
    });

    it('should allow ADMIN to get all users', async () => {
        const response = await request(app)
            .get('/api/users')
            .set('x-token', adminToken);

        if (response.status !== 200) {
            console.error('GET /api/users failed:', response.status, JSON.stringify(response.body, null, 2));
        }
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(false);
        expect(response.body).toHaveProperty('total');
        expect(response.body).toHaveProperty('users');
    });

    it('should deny CLIENT from getting all users', async () => {
        const response = await request(app)
            .get('/api/users')
            .set('x-token', clientToken);

        expect(response.status).toBe(403);
    });

    it('should allow ADMIN to update a user', async () => {
        const response = await request(app)
            .put(`/api/users/${userId}`)
            .set('x-token', adminToken)
            .send({ name: 'Updated Name' });

        expect(response.status).toBe(200);

        const updatedUser = await mongoose.connection.collection('users').findOne({ _id: new mongoose.Types.ObjectId(userId) });
        expect(updatedUser?.name).toBe('Updated Name');
    });

    it('should allow ADMIN to delete a user (Soft Delete)', async () => {
        const response = await request(app)
            .delete(`/api/users/${userId}`)
            .set('x-token', adminToken);

        expect(response.status).toBe(200);

        const deletedUser = await mongoose.connection.collection('users').findOne({ _id: new mongoose.Types.ObjectId(userId) });
        expect(deletedUser?.status).toBe(false);
    });

    it('should not return deleted users in GET /users', async () => {
        // First delete it
        await request(app)
            .delete(`/api/users/${userId}`)
            .set('x-token', adminToken);

        const response = await request(app)
            .get('/api/users')
            .set('x-token', adminToken);



        const found = response.body.users.find((u: any) => u.id === userId);
        expect(found).toBeUndefined();
    });
});
