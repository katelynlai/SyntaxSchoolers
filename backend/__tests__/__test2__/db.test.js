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

describe('Level 2 Database Tests', () => {
    test('level2_sentences table contains expected columns', async () => {
        const result = await db.query('SELECT * FROM level2_sentences LIMIT 1');
        const row = result.rows[0];
        expect(row).toHaveProperty('french_full');
        expect(row).toHaveProperty('french_with_gap');
        expect(row).toHaveProperty('missing_word');
        expect(row).toHaveProperty('distractors');
        expect(row).toHaveProperty('english_translation');
    });

    test('sample sentence from level2_sentences joins correctly with category', async () => {
        const result = await db.query(`
            SELECT s.*, c.category_name
            FROM level2_sentences s
            JOIN category c ON s.category_id = c.category_id
            LIMIT 1
        `);
        expect(result.rows.length).toBeGreaterThan(0);
        expect(result.rows[0]).toHaveProperty('category_name');
    });

    test('levelprogress table contains expected columns', async () => {
        const result = await db.query('SELECT * FROM levelprogress LIMIT 1');
        const row = result.rows[0];
        expect(row).toHaveProperty('user_id');
        expect(row).toHaveProperty('level_id');
        expect(row).toHaveProperty('questions_answered');
        expect(row).toHaveProperty('questions_correct');
        expect(row).toHaveProperty('total_questions');
    });

    test('levelprogress updates correctly after sentence submission', async () => {
        const userId = 1;
        const levelId = 2;
        const isCorrect = true;

        await db.query(`
            INSERT INTO levelprogress (user_id, level_id, questions_answered, questions_correct, total_questions)
            VALUES ($1, $2, 1, $3, 5)
            ON CONFLICT (user_id, level_id) DO UPDATE
            SET questions_answered = levelprogress.questions_answered + 1,
                questions_correct = levelprogress.questions_correct + $3
        `, [userId, levelId, isCorrect ? 1 : 0]);

        const result = await db.query(`
            SELECT * FROM levelprogress WHERE user_id = $1 AND level_id = $2
        `, [userId, levelId]);

        expect(result.rows.length).toBe(1);
        expect(result.rows[0].questions_answered).toBe(1);
        expect(result.rows[0].questions_correct).toBe(isCorrect ? 1 : 0);
    });
});