const db = require('../database/connect'); // Adjust path as needed for your DB connection

class Level2 {
  static async getRandomSentence() {
    const query = `
    SELECT 
        sentence_id,
        french_full,
        french_with_gap,
        missing_word,
        distractors,
        english_translation
    FROM level2_sentences
    ORDER BY RANDOM()
    LIMIT 1;
`;
  
    const result = await db.query(query);
    return result.rows[0] || null;
  }


  static async checkAnswer(sentenceId, answer) {
    const query = `
      SELECT missing_word
      FROM level2_sentences
      WHERE sentence_id = $1
    `;
    const values = [sentenceId];

    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      throw new Error('Sentence not found');
    }

    const correctAnswer = result.rows[0].missing_word;

    // Compare case-insensitive and trimmed answer to correctAnswer
    return correctAnswer.trim().toLowerCase() === answer.trim().toLowerCase();
  }
}
module.exports = Level2;






















/*
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
*/