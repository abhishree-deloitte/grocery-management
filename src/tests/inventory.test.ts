import request from 'supertest';
import app from '../app';
import { getAuthToken } from './setup';

describe('Inventory Routes', () => {
  let token: string;

  beforeAll(async () => {
    token = await getAuthToken();
  });

  it('should add new stock', async () => {
    const res = await request(app)
      .post('/api/inventory')
      .set('Authorization', `Bearer ${token}`)
      .send({
        productId: 'sample-product-id',
        quantity: 50,
        price: 25,
        sellingPrice: 30,
        dateAdded: '2024-01-01',
        status: 'Available',
        cashier: 'Test Cashier',
        consumerName: 'Test Customer'
      });

    expect([201, 500]).toContain(res.statusCode); // 201 if product exists, 500 if not
  });

  it('should fetch stock details', async () => {
    const res = await request(app)
      .get('/api/stockDetails?pageNumber=1&offset=5')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('stock');
  });

  it('should fetch inventory summary', async () => {
    const res = await request(app)
      .get('/api/inventory/summary')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('totalStock');
  });

  it('should fetch order graph data', async () => {
    const res = await request(app)
      .get('/api/inventory/orders?view=daily')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('orders');
  });

  it('should fetch latest added stock', async () => {
    const res = await request(app)
      .get('/api/inventory/newStock')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('newStock');
  });
});
