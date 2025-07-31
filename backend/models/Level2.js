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

  static async updateLevelProgress(userId, levelId, isCorrect) {
    const checkQuery = `
      SELECT * FROM levelprogress
      WHERE user_id = $1 AND level_id = $2;
    `;
    const existing = await db.query(checkQuery, [userId, levelId]);

    if (existing.rows.length === 0) {
      const insertQuery = `
        INSERT INTO levelprogress (
          user_id, level_id, questions_answered, questions_correct, total_questions
        )
        VALUES ($1, $2, $3, $4, $5);
      `;
      await db.query(insertQuery, [userId, levelId, 1, isCorrect ? 1 : 0, 5]);
    } else {
      const updateQuery = `
        UPDATE levelprogress
        SET
          questions_answered = questions_answered + 1,
          questions_correct = questions_correct + $3,
          level_status = CASE
            WHEN questions_answered + 1 >= total_questions THEN true
            ELSE level_status
          END
        WHERE user_id = $1 AND level_id = $2;
      `;
      await db.query(updateQuery, [userId, levelId, isCorrect ? 1 : 0]);
    }

    const statusQuery = `
      SELECT level_status
      FROM levelprogress
      WHERE user_id = $1 AND level_id = $2;
    `;
    const statusResult = await db.query(statusQuery, [userId, levelId]);
    return statusResult.rows[0]?.level_status || false;
  }


}
module.exports = Level2;