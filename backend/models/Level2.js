const db = require('../database/connect');

class Level2 {
    static async getLevel2Question() {
        try {
            const sentenceQuery = `SELECT * FROM sentences ORDER BY RANDOM() LIMIT 1`;

            const { rows } = await db.query(sentenceQuery);
            const sentence = rows[0];

            const words = sentence.french.split(' ');
            const missingWord = words[sentence.missing_index];
            words[sentence.missing_index] = '___'; // Replace the missing word with a placeholder

            const randomWordsQuery = `
                SELECT lang2_word FROM vocab
                WHERE lang2_word != $1 
                ORDER BY RANDOM() 
                LIMIT 3
            `;

            const {rows: randomWords} = await db.query(randomWordsQuery, [missingWord]);

            const options = [...randomWords.map(row => row.lang2_word), missingWord];
            const shuffledOptions = options.sort(() => 0.5 - Math.random());

            return {
                sentenceID: sentence.sentence_id,
                frenchwithMissing: words.join(' '),
                english: sentence.english,
                correctWord: missingWord,
                options: shuffledOptions,
            };
        } catch (error) {
            throw new Error(`Error fetching Level 2 question: ${error.message}`);
        }

    }
}

module.exports = Level2;