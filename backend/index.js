require('dotenv').config();

const api = require('./app');

app.listen(process.env.PORT, () => {
    console.log(`API listening on port ${process.env.PORT}...`);
})