import request from 'supertest';
import app from '../app.js'; // Make sure to include the .js extension

describe('Products API', () => {
  it('GET /api/products should return products', async () => {
    const response = await request(app)
      .get('/api/products')
      .expect('Content-Type', /json/)
      .expect(200);
    
    expect(Array.isArray(response.body)).toBe(true);
  });
});

