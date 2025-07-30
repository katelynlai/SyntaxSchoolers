require('dotenv').config();

const api = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(process.env.PORT, () => {
    console.log(`API listening on port ${process.env.PORT}...`);
})