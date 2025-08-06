const db = require('../database/connect');

class UserDashModel {
  static async getUserProgress(userId) {
    const result = await db.query(
      `SELECT level_1_complete, level_2_complete, level_3_complete, all_levels_complete 
       FROM overallprogress 
       WHERE user_id = $1`,
      [userId]
    );

    return result.rows[0];
  }
}

module.exports = UserDashModel;
