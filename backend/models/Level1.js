const db = require('../database/connect');

class Level {
    // Get Level 1 vocabulary questions (10 random words)
    static async getLevel1Questions() {
        try {
            const query = `
                SELECT v.vocab_id, v.lang1_word, v.lang2_word, c.category_name 
                FROM vocab v
                JOIN category c ON v.category_id = c.category_id
                ORDER BY RANDOM()
                LIMIT 10
            `;
            
            const result = await db.query(query);
            
            return result.rows.map((row, index) => ({
                questionNumber: index + 1,
                vocabId: row.vocab_id,
                englishWord: row.lang1_word,
                frenchWord: row.lang2_word,
                category: row.category_name
            }));
        } catch (error) {
            throw new Error(`Error getting Level 1 questions: ${error.message}`);
        }
    }

    // Start Level 1 for a user
    static async startLevel1(userId) {
        try {
            // Check if user already has Level 1 progress
            let checkQuery = `
                SELECT * FROM levelprogress 
                WHERE user_id = $1 AND level_id = 1
            `;
            
            let result = await db.query(checkQuery, [userId]);
            
            if (result.rows.length === 0) {
                // Create new Level 1 progress
                const insertQuery = `
                    INSERT INTO levelprogress (user_id, level_id, questions_answered, questions_correct, total_questions, level_status)
                    VALUES ($1, 1, 0, 0, 10, false)
                    RETURNING *
                `;
                
                result = await db.query(insertQuery, [userId]);
            }
            
            // Get the questions for Level 1
            const questions = await Level.getLevel1Questions();
            
            return {
                levelId: 1,
                userId: userId,
                progress: result.rows[0],
                questions: questions
            };
        } catch (error) {
            throw new Error(`Error starting Level 1: ${error.message}`);
        }
    }

    // Get user's Level 1 progress
    static async getLevel1Progress(userId) {
        try {
            const query = `
                SELECT * FROM levelprogress 
                WHERE user_id = $1 AND level_id = 1
            `;
            
            const result = await db.query(query, [userId]);
            
            if (result.rows.length === 0) {
                return null; // User hasn't started Level 1 yet
            }
            
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error getting Level 1 progress: ${error.message}`);
        }
    }

    // Submit Level 1 answers and update progress
    static async submitLevel1Answers(userId, correctAnswers, totalQuestions) {
        try {
            const questionsAnswered = totalQuestions;
            const questionsCorrect = correctAnswers;
            const isComplete = questionsAnswered >= totalQuestions;
            
            const query = `
                UPDATE levelprogress 
                SET questions_answered = $3, 
                    questions_correct = $4,
                    total_questions = $5,
                    level_status = $6
                WHERE user_id = $1 AND level_id = $2
                RETURNING *
            `;
            
            const result = await db.query(query, [
                userId, 
                1, 
                questionsAnswered, 
                questionsCorrect, 
                totalQuestions,
                isComplete
            ]);
            
            if (result.rows.length === 0) {
                throw new Error('Level 1 progress not found for user');
            }
            
            const progress = result.rows[0];
            const percentage = Math.round((questionsCorrect / totalQuestions) * 100);
            
            return {
                ...progress,
                percentage: percentage,
                message: isComplete ? 'Level 1 completed!' : 'Progress saved'
            };
        } catch (error) {
            throw new Error(`Error submitting Level 1 answers: ${error.message}`);
        }
    }

    // Get words for current round (used by game session)
    static getCurrentRoundWords(questions, startIndex, wordsPerRound) {
        const endIndex = Math.min(startIndex + wordsPerRound, questions.length);
        const roundQuestions = questions.slice(startIndex, endIndex);
        
        const englishWords = roundQuestions.map(q => ({
            id: q.vocabId,
            text: q.englishWord,
            matched: false
        }));
        
        const frenchWords = roundQuestions.map(q => ({
            id: q.vocabId,
            text: q.frenchWord,
            matched: false
        }));
        
        // Shuffle French words to make it challenging
        const shuffledFrench = [...frenchWords].sort(() => Math.random() - 0.5);
        
        return {
            english: englishWords,
            french: shuffledFrench
        };
    }
}

module.exports = Level;
