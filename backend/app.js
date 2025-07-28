const express = require('express');
const cors = require('cors');
const path = require('path');

// Middleware
const authentication = require('./middleware/authentication');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


module.exports = app;
