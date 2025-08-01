const request = require('supertest');
const app = require('../app');

describe('Level 2 Controller Integration Tests', () => {
  test('GET /app/level2/random returns a sentence object', async () => {
    const response = await request(app).get('/app/level2/random');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('sentence_id');
    expect(response.body).toHaveProperty('missing_word');
  });

  test('POST /app/level2/check handles correct answer', async () => {
    const response = await request(app)
      .post('/app/level2/check')
      .send({
        sentenceId: 1,
        answer: 'hôtel',
        userId: 1,
        levelId: 2
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('correct', true);
    expect(response.body).toHaveProperty('levelStatus');
  });

  test('POST /app/level2/check handles incorrect answer', async () => {
    const response = await request(app)
      .post('/app/level2/check')
      .send({
        sentenceId: 1,
        answer: 'voiture',
        userId: 1,
        levelId: 2
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('correct', false);
  });
});