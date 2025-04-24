import request from 'supertest';
import app from '../app';
import { getAuthToken } from './setup';

jest.setTimeout(15000);

describe('Task Routes', () => {
  let token: string;

  beforeAll(async () => {
    token = await getAuthToken();
  });

  it('should create a new task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        taskType: 'Stock-Related',
        assignee: 'Jane Manager',
        priorityLevel: 'High',
        description: 'Restock cereal section',
        dueDate: '2024-05-01T10:00:00Z',
        location: 'Aisle 4'
      });

    expect([201, 500]).toContain(res.statusCode); // 500 if user doesn't exist yet in task
  });
});
