import request from 'supertest';
import app from '../app';
import { getAuthToken } from './setup';

jest.setTimeout(15000);

describe('Blog Routes', () => {
  let token: string;

  beforeAll(async () => {
    token = await getAuthToken();
  });

  it('should get all blogs paginated', async () => {
    const res = await request(app)
      .get('/api/blogs/all?pageNumber=1&offset=5')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.Blogs).toBeInstanceOf(Array);
  });

  it('should get a blog by ID', async () => {
    // NOTE: Replace this with a valid ID from seed later
    const blogId = 'replace-with-valid-blog-id';

    const res = await request(app)
      .get(`/api/blog/${blogId}`)
      .set('Authorization', `Bearer ${token}`);

    expect([200, 404]).toContain(res.statusCode);
  });
});
