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

    }
      

module.exports = Level3;
