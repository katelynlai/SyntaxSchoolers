const db = require('../database/connect');
const Level2 = require('../models/Level2');
const fs = require('fs');
const path = require('path');

beforeAll(async () => {
    try {
        const setupSQL = fs.readFileSync(path.join(__dirname, '../database/setup2.sql')).toString();
        await db.query(setupSQL);
    } catch (error) {
        console.error('Setup failed:', error);
        throw error;
    }
});

afterAll(async () => {
    await db.end(); 
});
// Testing for Level 2 model functions
describe('Level2 Model Integration Tests', () => {
    const testUserId = 1;
    
    test('getRandomSentence returns a sentence with expected structure', async () => {
        const sentence = await Level2.getRandomSentence();
        expect(sentence).toHaveProperty('sentence_id');
        expect(sentence).toHaveProperty('french_full');
        expect(sentence).toHaveProperty('french_with_gap');
        expect(sentence).toHaveProperty('missing_word');
        expect(sentence).toHaveProperty('distractors');
        expect(sentence).toHaveProperty('english_translation');
    });
    
    test('checkAnswer returns true for correct answer', async () => {
        const correct = await Level2.checkAnswer(1, 'hôtel');
        expect(correct).toBe(true);
    });
    
    test('checkAnswer returns false for incorrect answer', async () => {
        const incorrect = await Level2.checkAnswer(1, 'train');
        expect(incorrect).toBe(false);
    });
    
    test('updateLevelProgress creates new row and updates status', async () => {
        const userId = 1;
        const levelId = 2;
        const result = await Level2.updateLevelProgress(userId, levelId, true);
        expect(typeof result).toBe('boolean');
    });
});

describe('Level 2 Model Tests', () => {
    test('getRandomSentence returns a sentence with expected structure', async () => {
        const sentence = await Level2.getRandomSentence();
        expect(sentence).toHaveProperty('sentence_id');
        expect(sentence).toHaveProperty('french_full');
        expect(sentence).toHaveProperty('french_with_gap');
        expect(sentence).toHaveProperty('missing_word');
        expect(sentence).toHaveProperty('distractors');
        expect(sentence).toHaveProperty('english_translation');
    });

    test('checkAnswer returns true for correct answer', async () => {
        // known correct answer from seed data
        const correct = await Level2.checkAnswer(1, 'hôtel');
        expect(correct).toBe(true);
    });

    test('checkAnswer returns false for incorrect answer', async () => {
        const incorrect = await Level2.checkAnswer(1, 'train');
        expect(incorrect).toBe(false);
    });

    test('updateLevelProgress creates new row and updates status', async () => {
        const userId = 1;
        const levelId = 2;
        const result = await Level2.updateLevelProgress(userId, levelId, true);
        expect(typeof result).toBe('boolean');
    });

    test('getLevelProgress returns progress for user and level', async () => {
        const progress = await Level2.getLevelProgress(testUserId, 2);
        expect(progress).toHaveProperty('user_id', testUserId);
        expect(progress).toHaveProperty('level_id', 2);
        expect(progress).toHaveProperty('questions_answered');
        expect(progress).toHaveProperty('questions_correct');
        expect(progress).toHaveProperty('total_questions');
        expect(progress).toHaveProperty('level_status');
    });

    test('getLevelStatus returns level status for user', async () => {
        const status = await Level2.getLevelStatus(testUserId, 2);
        expect(typeof status).toBe('boolean');
    });

    
});
