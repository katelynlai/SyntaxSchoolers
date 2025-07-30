const db = require('../database/connect');

class Level3 {
    static async getRandomSentence() {
        const query = `
            SELECT sentence_id, english, french, shuffled, category_id
            FROM sentences
            ORDER BY RANDOM()
            LIMIT 1;
          `;
          const { rows } = await db.query(query);
          return rows[0];
        }
    static async getSentenceById(id) {
        const query = `
            SELECT sentence_id AS id, english, french, shuffled, category_id
             FROM sentences
            WHERE sentence_id = $1
              LIMIT 1;
            `;
            const { rows } = await db.query(query, [id]);
            return rows[0];
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
      

module.exports = Level3;
