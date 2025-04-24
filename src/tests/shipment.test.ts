import request from 'supertest';
import app from '../app';
import { getAuthToken } from './setup';

describe('Shipment Routes', () => {
  let token: string;

  beforeAll(async () => {
    token = await getAuthToken();
  });

  it('should fetch shipment details with pagination', async () => {
    const res = await request(app)
      .get('/api/shipment/shipmentDetails?pageNumber=1&offset=5')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('shipment');
  });

  it('should return 401 without auth token', async () => {
    const res = await request(app).get('/api/shipment/shipmentDetails');
    expect(res.statusCode).toBe(401);
  });
});
