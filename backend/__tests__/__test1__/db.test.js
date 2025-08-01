const db = require('../../database/connect');
const fs = require('fs');
const path = require('path');

beforeAll(async () => {
  const sql = fs.readFileSync(path.join(__dirname, '../database/setup.sql')).toString();
  await db.query(sql);
});

afterAll(async () => {
  await db.end();
});

describe('Database Structure and Content Tests', () => {
  test('Users table contains the default user', async () => {
    const result = await db.query('SELECT * FROM users WHERE user_id = 1');
    expect(result.rows.length).toBe(1);
    expect(result.rows[0]).toHaveProperty('username');
  });

  test('Vocab table has correct data', async () => {
    const vocab = await db.query('SELECT COUNT(*) FROM vocab');
    expect(Number(vocab.rows[0].count)).toBeGreaterThan(0);
  });

  test('Sentences table has correct data', async () => {
    const result = await db.query('SELECT COUNT(*) FROM sentences');
    expect(Number(result.rows[0].count)).toBeGreaterThan(0);
  });

  test('LevelProgress table inserts and fetches correctly', async () => {
    await db.query(
      'INSERT INTO levelprogress (user_id, level_id, questions_correct, total_questions, level_status) VALUES (1, 2, 3, 5, true)'
    );

    const res = await db.query(
      'SELECT * FROM levelprogress WHERE user_id = 1 AND level_id = 2'
    );

    expect(res.rows.length).toBe(1);
    expect(res.rows[0].questions_correct).toBe(3);
    expect(res.rows[0].total_questions).toBe(5);
  });

    test('Sentences table has French and English text', async () => {
        const result = await db.query('SELECT * FROM sentences LIMIT 1');

        expect(result.rows.length).toBe(1);
        const row = result.rows[0];
        expect(row).toHaveProperty('french');
        expect(row).toHaveProperty('english');
    });
});
