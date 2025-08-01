const request = require('supertest');
const app = require('../app');
const db = require('../database/connect');
const fs = require('fs');
const path = require('path');

beforeAll(async () => {
  try {
    const setupSQL = fs.readFileSync(path.join(__dirname, '../database/setup.sql')).toString();
    await db.query(setupSQL);
  } catch (error) {
    console.error('Setup failed:', error);
    throw error;
  }
});

afterAll(async () => {
  await db.end();
});

describe('Level 1 Integration Tests', () => {
  describe('POST /api/levels/1/start', () => {
    it('returns level 1 questions and count', async () => {
      const res = await request(app).post('/api/levels/1/start');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.questions)).toBe(true);
      expect(typeof res.body.data.totalQuestions).toBe('number');
    });
  });

  describe('POST /api/levels/1/submit', () => {
    it('submits answers and returns score/percentage', async () => {
      const startRes = await request(app).post('/api/levels/1/start');
      const questions = startRes.body.data.questions;

      const answers = questions.map((q, i) => ({
        englishId: q.englishId,
        frenchId: i % 2 === 0 ? q.englishId : 9999  // Intentionally wrong for half
      }));

      const res = await request(app)
        .post('/api/levels/1/submit')
        .send({ answers });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(typeof res.body.data.correctAnswers).toBe('number');
      expect(typeof res.body.data.percentage).toBe('number');
    });
  });

  describe('GET /api/levels/1/progress', () => {
    it('returns saved progress after submission', async () => {
      const res = await request(app).get('/api/levels/1/progress');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('questions_correct');
      expect(res.body.data).toHaveProperty('total_questions');
    });

    it('returns 404 if no progress found (simulate user with no data)', async () => {
      const tempApp = require('express')();
      const levelRoutes = require('../routers/level1Routes');
      tempApp.use((req, res, next) => {
        req.user = { id: 999 }; // User with no data
        next();
      });
      tempApp.use('/api/levels', levelRoutes);

      const res = await request(tempApp).get('/api/levels/1/progress');
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});