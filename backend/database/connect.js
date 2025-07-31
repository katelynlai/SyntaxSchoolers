const { Pool } = require("pg");
require("dotenv").config();


const db = new Pool({
    connectionString: process.env.DB_URL,
    ssl: {
        rejectUnauthorized: false  // Required by Supabase
  }
})

console.log("DB connection established.")
console.log("DB URL from env:", process.env.DB_URL);

module.exports = db;