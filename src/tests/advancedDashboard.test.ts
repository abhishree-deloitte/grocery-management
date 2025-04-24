import request from 'supertest';
import app from '../app';
import { getAuthToken } from './setup';

describe('Advanced Dashboard Routes', () => {
  let token: string;

  beforeAll(async () => {
    token = await getAuthToken(); 
  });

  it('should fetch orders grouped by date', async () => {
    const res = await request(app)
      .get('/api/dashboard/insights/orders-by-date')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('orders');
  });

  it('should fetch stock grouped by supplier', async () => {
    const res = await request(app)
      .get('/api/dashboard/insights/stock-by-supplier')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(typeof res.body.data).toBe('object');
  });

  it('should fetch critical alerts', async () => {
    const res = await request(app)
      .get('/api/dashboard/alerts')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('lowStock');
    expect(res.body.data).toHaveProperty('delayedShipments');
  });

  it('should fetch top restocked products', async () => {
    const res = await request(app)
      .get('/api/dashboard/trends/restocks')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should fetch financial overview', async () => {
    const res = await request(app)
      .get('/api/dashboard/financials')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('totalCost');
    expect(res.body.data).toHaveProperty('estimatedRevenue');
    expect(res.body.data).toHaveProperty('margin');
  });
});
