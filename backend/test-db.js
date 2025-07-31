require('dotenv').config({ path: '.env.test' });
const db = require('./database/connect');

(async () => {
  try {
    const result = await db.query('SELECT NOW()');
    console.log('DB connected:', result.rows[0]);
    await db.end();
  } catch (err) {
    console.error('DB connection failed:', err);
  }
})();