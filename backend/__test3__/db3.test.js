const db = require('../database/connect');
const request = require('supertest');
const app = require('../app');

describe('Level 3 Database Tests', () => {
    test('Sentences table contains required fields and data', async () => {
        const result = await db.query('SELECT * FROM sentences LIMIT 1');
        const row = result.rows[0];
        expect(row).toHaveProperty('sentence_id');
        expect(row).toHaveProperty('french');
        expect(row).toHaveProperty('english');
        expect(row).toHaveProperty('shuffled');
        expect(row).toHaveProperty('category_id');
    });

    test('Categories table contains required fields and data', async () => {
        const result = await db.query('SELECT * FROM categories LIMIT 1');
        const row = result.rows[0];
        expect(row).toHaveProperty('category_id');
        expect(row).toHaveProperty('name');
        expect(row).toHaveProperty('description');
        expect(row).toHaveProperty('level_id');
        expect(row).toHaveProperty('created_at');
        expect(row).toHaveProperty('updated_at');
    });

    test('LevelProgress table contains required fields and data', async () => {
        const result = await db.query('SELECT * FROM levelprogress LIMIT 1');
        const row = result.rows[0];
        expect(row).toHaveProperty('user_id');
        expect(row).toHaveProperty('level_id');
        expect(row).toHaveProperty('questions_answered');
        expect(row).toHaveProperty('questions_correct');
        expect(row).toHaveProperty('total_questions');
        expect(row).toHaveProperty('level_status');
        expect(row).toHaveProperty('created_at');
        expect(row).toHaveProperty('updated_at');
    });

    test('LevelProgress entry created on sentence submission', async () => {
        const res = await request(app).get('/app/sentence');
        const sentence = res.body;

        await request(app).post('/app/sentence/submit-sentence').send({
            sentenceId: sentence.sentence_id,
            sentence: sentence.french.trim().split(' '),
            userId: 1,
            levelId: 3
        });

        const result = await db.query('SELECT * FROM levelprogress WHERE user_id = 1 AND level_id = 3');
        expect(result.rows.length).toBeGreaterThan(0);
    });

    test('LevelProgress updates on correct sentence submission', async () => {
        const res = await request(app).get('/app/sentence');
        const sentence = res.body;
        await request(app).post('/app/sentence/submit-sentence').send({
            sentenceId: sentence.sentence_id,
            sentence: sentence.french.trim().split(' '),
            userId: 1,
            levelId: 3
        });
        const result = await db.query('SELECT * FROM levelprogress WHERE user_id = 1 AND level_id = 3');
        expect(result.rows[0]).toHaveProperty('questions_answered', 1);
        expect(result.rows[0]).toHaveProperty('questions_correct', 1);
    });

    test('Foreign keys in sentences resolve to valid categories', async () => {
        const result = await db.query(`
            SELECT s.*, c.name
            FROM sentences s
            JOIN categories c ON s.category_id = c.category_id
            LIMIT 1
        `);
        expect(result.rows.length).toBe(1);
        expect(result.rows[0]).toHaveProperty('name');
    });

    test('LevelProgress updates correctly on incorrect sentence submission', async () => {
        const res = await request(app).get('/app/sentence');
        const sentence = res.body;
        await request(app).post('/app/sentence/submit-sentence').send({
            sentenceId: sentence.sentence_id,
            sentence: ['wrong', 'order'],
            userId: 1,
            levelId: 3
        });
        const result = await db.query('SELECT * FROM levelprogress WHERE user_id = 1 AND level_id = 3');
        expect(result.rows[0]).toHaveProperty('questions_answered', 2);
        expect(result.rows[0]).toHaveProperty('questions_correct', 1);
    });
});