const path = require('path');
require('dotenv').config();
const app = require('./app');

const pages = [
  { route: '/', file: '../frontend/homepage/homepage.html' },
  { route: '/level1', file: '../frontend/level1/level1.html' },
];

pages.forEach(page => {
  app.get(page.route, (req, res) => {
    res.sendFile(path.join(__dirname, page.file));
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`API listening on port ${PORT}...`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
});