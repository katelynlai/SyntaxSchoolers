require('dotenv').config();

const app = require('../backend/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`API listening on port ${PORT}...`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
});