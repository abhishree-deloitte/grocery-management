import request from 'supertest';
import app from '../app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// beforeAll(async () => {
//   await prisma.user.deleteMany(); // Clean DB before starting
// });

describe('Auth Routes', () => {
  const testUser = {
    username: 'testuser4',
    password: 'test1234',
    firstName: 'Test',
    lastName: 'User',
    email: 'testuser4@example.com',
    phone: '1234567890'
  };

  let token = '';

  it('should signup a new user', async () => {
    const res = await request(app).post('/api/auth/signup').send(testUser);
    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  it('should login the user', async () => {
    const res = await request(app).post('/api/auth/signin').send({
      username: testUser.username,
      password: testUser.password
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('should fetch the user profile', async () => {
    const res = await request(app)
      .get('/api/user/profile')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.username).toBe(testUser.username);
  });
});
