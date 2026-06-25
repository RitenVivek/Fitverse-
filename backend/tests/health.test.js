const request = require('supertest');
const { expect } = require('chai');
const app = require('../server');

describe('Backend health check', () => {
  it('returns status ok from /api/health', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('status', 'ok');
    expect(res.body).to.have.property('timestamp');
  });
});
