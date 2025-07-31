const Level3 = require('../models/Level3');

describe('Level 3 Model Tests', () => {
    // Test the Level 3 model to ensure it works correctly
    beforeAll(async () => {
        await Level3.initialize();
    });
    afterAll(async () => {
        await Level3.close();
    });
    test('getRandomSentence returns a sentence with required fields', async () => {
        const sentence = await Level3.getRandomSentence();
        expect(sentence).toHaveProperty('sentence_id');
        expect(sentence).toHaveProperty('english');
        expect(sentence).toHaveProperty('french');
        expect(sentence).toHaveProperty('shuffled');
        expect(sentence).toHaveProperty('category_id');
    });
    test('getSentenceById returns a sentence by ID', async () => {
        const sentence = await Level3.getRandomSentence();  
        const fetched = await Level3.getSentenceById(sentence.sentence_id);
        expect(fetched).toHaveProperty('id', sentence.sentence_id);
        expect(fetched).toHaveProperty('english', sentence.english);
        expect(fetched).toHaveProperty('french', sentence.french);
        expect(fetched).toHaveProperty('shuffled', sentence.shuffled);
        expect(fetched).toHaveProperty('category_id', sentence.category_id);
    });

    test('updateLevelProgress creates new entry if none exists', async () => {
        const userId = 1;
        const levelId = 3;
        const isCorrect = true; 
        await Level3.updateLevelProgress(userId, levelId, isCorrect);
        const progress = await Level3.getLevelProgress(userId, levelId);
            expect(progress).toHaveProperty('user_id', userId);
            expect(progress).toHaveProperty('level_id', levelId);
            expect(progress).toHaveProperty('questions_answered', 1);
            expect(progress).toHaveProperty('questions_correct', 1);
            expect(progress).toHaveProperty('total_questions', 5);
            expect(progress).toHaveProperty('level_status', false);
        
        const status = await Level3.getLevelStatus(userId, levelId);
        expect(status).toBe(false);
    }); 
    test('updateLevelProgress updates existing entry', async () => {
        const userId = 1; //user ID for testing
        const levelId = 3; // Level ID for testing
        const isCorrect = false; // submitting wrong answer
        await Level3.updateLevelProgress(userId, levelId, isCorrect);
        const progress = await Level3.getLevelProgress(userId, levelId);
        expect(progress).toHaveProperty('user_id', userId);
        expect(progress).toHaveProperty('level_id', levelId);
        expect(progress).toHaveProperty('questions_answered', 2);
        expect(progress).toHaveProperty('questions_correct', 1);
        expect(progress).toHaveProperty('total_questions', 5);
        expect(progress).toHaveProperty('level_status', false);
        const status = await Level3.getLevelStatus(userId, levelId);
        expect(status).toBe(false);
    });

    test('getLevel3Sentence returns a valid sentence object', async () => {
        const sentence = await Level3.getLevel3Sentence();
        expect(sentence).toHaveProperty('sentence_id');
        expect(sentence).toHaveProperty('french');
        expect(sentence).toHaveProperty('english');
        expect(sentence).toHaveProperty('shuffled');
    });

    test('checkLevel3Sentence returns true for correct sentence', async () => {
        const sentence = await Level3.getLevel3Sentence();
        const input = sentence.french.trim().split(' ');
        const result = await Level3.checkLevel3Sentence(sentence.sentence_id, input);
        expect(result.correct).toBe(true);
    });

    test('checkLevel3Sentence returns false for incorrect sentence', async () => {
        const sentence = await Level3.getLevel3Sentence();
        const wrong = ['this', 'is', 'wrong'];
        const result = await Level3.checkLevel3Sentence(sentence.sentence_id, wrong);
        expect(result.correct).toBe(false);
    });
});