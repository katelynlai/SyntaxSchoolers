const request = require('supertest');
const app = require('../app');

describe('Level 2 Integration Tests', () => {
    test('GET /app/level2/random returns a valid sentence with distractors', async () => {
        const res = await request(app).get('/app/level2/random');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('sentence_id');
        expect(res.body).toHaveProperty('french_with_gap');
        expect(res.body).toHaveProperty('missing_word');
        expect(res.body).toHaveProperty('distractors');
        expect(Array.isArray(res.body.distractors)).toBe(true);
        expect(res.body).toHaveProperty('english_translation');
    });

    test('POST /app/level2/check returns correct: false for wrong answer', async () => {
        const random = await request(app).get('/app/level2/random');
        const sentence = random.body;

        const res = await request(app).post('/app/level2/check').send({
            sentenceId: sentence.sentence_id,
            answer: 'incorrect-word',
            userId: 1,
            levelId: 2
        });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('correct', false);
        expect(res.body).toHaveProperty('levelStatus');
    });

    test('POST /app/level2/check returns 400 for invalid input', async () => {
        const res = await request(app).post('/app/level2/check').send({});
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error');
    });
});

describe('Level 2 Integration Tests', () => {
    test('POST /app/level2/check returns correct: true for correct answer', async () => {
        const random = await request(app).get('/app/level2/random');
        const sentence = random.body;
        const res = await request(app).post('/app/level2/check').send({
        sentenceId: sentence.sentence_id,
        answer: sentence.missing_word,
        userId: 1,
        levelId: 2
    });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('correct', true);
        expect(res.body).toHaveProperty('levelStatus');
    });

    test('POST /app/level2/check returns correct: false for wrong answer', async () => {
        const random = await request(app).get('/app/level2/random');
        const sentence = random.body;

        const res = await request(app).post('/app/level2/check').send({
        sentenceId: sentence.sentence_id,
        answer: 'incorrect-word',
        userId: 1,
        levelId: 2
    });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('correct', false);
        expect(res.body).toHaveProperty('levelStatus');
    });

    test('POST /app/level2/check returns 400 for invalid input', async () => {
        const res = await request(app).post('/app/level2/check').send({});
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error');
    });
});