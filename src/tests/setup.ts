import request from 'supertest';
import app from '../app';

export const getAuthToken = async () => {
  const user = {
    username: 'dashboardtest',
    password: 'test1234',
    firstName: 'Dash',
    lastName: 'Board',
    email: 'dash@test.com',
    phone: '1234567890',
  };

  // Try login directly first
  const login = await request(app).post('/api/auth/signin').send({
    username: user.username,
    password: user.password,
  });

  if (login.body.token) {
    return login.body.token;
  }

  // Otherwise, signup then login
  await request(app).post('/api/auth/signup').send(user);
  const res = await request(app).post('/api/auth/signin').send({
    username: user.username,
    password: user.password,
  });

  return res.body.token;
};
