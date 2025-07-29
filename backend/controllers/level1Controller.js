const Level = require('../models/Level1');

class SimpleLevelController {
    // POST /api/levels/1/start - Start Level 1 (stateless)
    static async startLevel1(req, res) {
        try {
            const userId = req.user.id;
            
            // Just get questions and return them
            const questions = await Level.getLevel1Questions();
            
            res.status(200).json({
                success: true,
                message: 'Level 1 started',
                data: {
                    questions: questions,
                    totalQuestions: questions.length
                }
            });
        } catch (error) {
            console.error('Error starting Level 1:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to start Level 1'
            });
        }
    }

    // POST /api/levels/1/submit - Submit all answers at once
    static async submitLevel1(req, res) {
        try {
            const userId = req.user.id;
            const { answers } = req.body; // Array of {englishId, frenchId} pairs
            
            // Get questions to validate against
            const questions = await Level.getLevel1Questions();
            
            // Count correct answers
            let correctCount = 0;
            answers.forEach(answer => {
                if (answer.englishId === answer.frenchId) {
                    correctCount++;
                }
            });
            
            // Save to database
            const result = await Level.submitLevel1Answers(userId, correctCount, questions.length);
            
            const percentage = Math.round((correctCount / questions.length) * 100);
            
            res.status(200).json({
                success: true,
                message: 'Level 1 completed!',
                data: {
                    correctAnswers: correctCount,
                    totalQuestions: questions.length,
                    percentage: percentage,
                    ...result
                }
            });
        } catch (error) {
            console.error('Error submitting Level 1:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to submit Level 1'
            });
        }
    }

    // GET /api/levels/1/progress - Get saved progress
    static async getLevel1Progress(req, res) {
        try {
            const userId = req.user.id;
            const progress = await Level.getLevel1Progress(userId);
            
            if (!progress) {
                return res.status(404).json({
                    success: false,
                    message: 'No progress found'
                });
            }
            
            res.status(200).json({
                success: true,
                message: 'Progress retrieved',
                data: progress
            });
        } catch (error) {
            console.error('Error getting progress:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to get progress'
            });
        }
    }
}

module.exports = SimpleLevelController;
