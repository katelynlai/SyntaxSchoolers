const express = require('express');
const cors = require('cors');
const db = require('./database/connect');

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

