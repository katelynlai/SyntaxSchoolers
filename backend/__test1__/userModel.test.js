const db = require('../database/connect');
const Level = require('../models/Level1');
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

//testing for startLevel1
describe('Level1 Model Integration Tests', () => {
  const testUserId = 1;

  test('startLevel1 creates progress row and returns vocab-style questions', async () => {
    const result = await Level.startLevel1(testUserId);

    expect(result).toBeDefined();
    expect(Array.isArray(result.questions)).toBe(true);
    expect(result.questions.length).toBeGreaterThan(0);

    const question = result.questions[0];
    expect(question).toHaveProperty('vocabId');
    expect(question).toHaveProperty('englishWord');
    expect(question).toHaveProperty('frenchWord');
    expect(question).toHaveProperty('category');
    expect(question).toHaveProperty('questionNumber');
  });

  test('getLevel1Questions returns vocab-style question data', async () => {
    const questions = await Level.getLevel1Questions();

    expect(Array.isArray(questions)).toBe(true);
    expect(questions.length).toBeGreaterThan(0);

    const question = questions[0];
    expect(question).toHaveProperty('vocabId');
    expect(question).toHaveProperty('englishWord');
    expect(question).toHaveProperty('frenchWord');
    expect(question).toHaveProperty('category');
    expect(question).toHaveProperty('questionNumber');
  });

  test('submitLevel1Answers stores results correctly', async () => {
    const correct = 3;
    const total = 5;

    const result = await Level.submitLevel1Answers(testUserId, correct, total);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('questions_correct', correct);
    expect(result).toHaveProperty('total_questions', total);
    expect(result).toHaveProperty('level_status', true);
  });

  test('getLevel1Progress returns saved progress', async () => {
    const progress = await Level.getLevel1Progress(testUserId);

    expect(progress).toBeDefined();
    expect(progress).toHaveProperty('questions_correct');
    expect(progress).toHaveProperty('total_questions');
    expect(progress).toHaveProperty('level_status', true);
  });
});