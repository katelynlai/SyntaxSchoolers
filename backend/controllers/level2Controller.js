const Level2 = require('../models/Level2');

class Level2Controller {
    static async getLevel2Question(req, res) {
        try {
            const question = await Level2.getLevel2Question();

            res.status(200).json({
                success: true,
                message: 'Level 2 question fetched successfully',
                data: question
            });
        } catch (error) {
            console.error('Error fetching Level 2 question:', error.message);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch Level 2 question'
            });
        }
    }
}

module.exports = Level2Controller;