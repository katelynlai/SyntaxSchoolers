require("dotenv").config();
const { Pool } = require("pg");

const db = new Pool({
    connectionString: process.env.DB_URL,
    ssl: {
        rejectUnauthorized: false,
    }
});

db.query("SELECT NOW()")
  .then(res => {
    console.log("Connected! Time:", res.rows[0]);
    db.end();
  })
  .catch(err => {
    console.error("DB connection failed:", err.message);
  });
