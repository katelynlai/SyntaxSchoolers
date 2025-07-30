const db = require('./backend/controllers/database/connect');

class Level2 {
    static async getLevel2Question(categoryId = 1) {
        try {
            const query = `
                SELECT v.vocab_id, v.lang1_word, v.lang2_word, c.category_name 
                FROM vocab v
                JOIN category c ON v.category_id = c.category_id
                WHERE v.category_id = $1
                ORDER BY RANDOM()
                LIMIT 4
            `;

            const result = await db.query(query, [categoryId]);

            if (result.rows.length < 4) {
                throw new Error('Not enough vocab entries in this category.');
            }

            const correct = result.rows[0]; 
            const options = result.rows.map(row => row.lang2_word);

            const shuffledOptions = options.sort(() => Math.random() - 0.5);

            const sentence = `Je vais à la ___.`; 

            return {
                sentence: sentence,
                correctWord: correct.lang2_word,
                options: shuffledOptions,
                category: correct.category_name
            };
        } catch (error) {
            throw new Error(`Error fetching Level 2 question: ${error.message}`);
        }
    }
}

module.exports = Level2;