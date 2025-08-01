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

describe('Level 1 Controller Integration Tests', () => {
  test('POST /api/levels/1/start returns questions and total count', async () => {
    const res = await request(app).post('/api/levels/1/start');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Level 1 started');

    const { questions, totalQuestions } = res.body.data;
    expect(Array.isArray(questions)).toBe(true);
    expect(typeof totalQuestions).toBe('number');
    expect(questions.length).toBeGreaterThan(0);
  });

  test('POST /api/levels/1/submit evaluates answers and returns score', async () => {
    // Start to get real questions
    const startRes = await request(app).post('/api/levels/1/start');
    const questions = startRes.body.data.questions;

    const answers = questions.map((q, i) => ({
      englishId: q.vocabId,
      frenchId: i % 2 === 0 ? q.vocabId : 9999 // Half wrong on purpose
    }));

    const submitRes = await request(app)
      .post('/api/levels/1/submit')
      .send({ answers });

    expect(submitRes.statusCode).toBe(200);
    expect(submitRes.body.success).toBe(true);
    expect(submitRes.body.message).toBe('Level 1 completed!');

    const { correctAnswers, totalQuestions, percentage } = submitRes.body.data;
    expect(typeof correctAnswers).toBe('number');
    expect(typeof totalQuestions).toBe('number');
    expect(typeof percentage).toBe('number');
    expect(correctAnswers).toBeLessThanOrEqual(totalQuestions);
  });

  test('GET /api/levels/1/progress returns saved progress for user 1', async () => {
    const res = await request(app).get('/api/levels/1/progress');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Progress retrieved');

    const progress = res.body.data;
    expect(progress).toHaveProperty('questions_correct');
    expect(progress).toHaveProperty('total_questions');
    expect(progress).toHaveProperty('level_status', true);
  });

  test('GET /api/levels/1/progress returns 404 for non-existent user', async () => {
    // Simulate a second user by overriding req.user temporarily
    const express = require('express');
    const levelRoutes = require('../routers/level1Routes');

    const testApp = express();
    testApp.use(express.json());
    testApp.use((req, res, next) => {
      req.user = { id: 9999 }; // a user not in DB
      next();
    });
    testApp.use('/api/levels', levelRoutes);

    const res = await request(testApp).get('/api/levels/1/progress');

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('No progress found');
  });
});