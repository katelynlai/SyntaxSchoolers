const request = require('supertest');
const app = require('../../app');

describe('Level 3 Controller Tests', () => {
    test('GET /app/sentence returns sentence with shuffled field', async () => {
        const res = await request(app).get('/app/sentence');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('shuffled');
    });

    test('POST /submit-sentence responds true for correct input', async () => {
        const res = await request(app).get('/app/sentence');
        const sentence = res.body;

        const response = await request(app)
            .post('/app/sentence/submit-sentence')
            .send({
                sentenceId: sentence.sentence_id,
                sentence: sentence.french.trim().split(' '),
                userId: 1,
                levelId: 3
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.correct).toBe(true);
    });

    test('POST /submit-sentence responds false for incorrect input', async () => {
        const res = await request(app).get('/app/sentence');
        const sentence = res.body;

        const response = await request(app)
            .post('/app/sentence/submit-sentence')
            .send({
                sentenceId: sentence.sentence_id,
                sentence: ['wrong', 'order'],
                userId: 1,
                levelId: 3
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.correct).toBe(false);
    });

    test('POST /submit-sentence returns 400 for invalid request', async () => {
         const res = await request(app)
            .post('/app/sentence/submit-sentence')
            .send({});
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error');
    });
});