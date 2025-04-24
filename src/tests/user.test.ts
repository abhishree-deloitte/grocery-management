import request from 'supertest';
import app from '../app';
import { getAuthToken } from './setup';

describe('User Routes', () => {
  let token: string;

  beforeAll(async () => {
    token = await getAuthToken();
  });

  it('should fetch the user profile', async () => {
    const res = await request(app)
      .get('/api/user/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('username');
    expect(res.body.data).toHaveProperty('email');
  });

  it('should return 401 if token is missing', async () => {
    const res = await request(app).get('/api/user/profile');
    expect(res.statusCode).toBe(401);
  });

  it('should return 403 if token is invalid', async () => {
    const res = await request(app)
      .get('/api/user/profile')
      .set('Authorization', 'Bearer invalidtoken');

    expect(res.statusCode).toBe(403);
  });
});
