import request from 'supertest';
import app from '../app';
import { getAuthToken } from './setup';

describe('Dashboard Routes', () => {
  let token: string;

  beforeAll(async () => {
    token = await getAuthToken();
  });

  it('should fetch orders summary with manual date range', async () => {
    const res = await request(app)
      .get('/api/dashboard/orders?startDate=2023-01-01&endDate=2024-12-31')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.orders).toHaveProperty('Active');
    expect(res.body.data.orders).toHaveProperty('Inactive');
  });

  it('should fetch shipment statistics', async () => {
    const res = await request(app)
      .get('/api/dashboard/shipment')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('Total');
    expect(res.body.data).toHaveProperty('Completed');
  });

  it('should fetch blog widget data', async () => {
    const res = await request(app)
      .get('/api/dashboard/blogs')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.Blogs).toBeInstanceOf(Array);
  });

  it('should fail without token on protected route', async () => {
    const res = await request(app).get('/api/dashboard/shipment');
    expect(res.statusCode).toBe(401);
  });
});
