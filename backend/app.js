const express = require('express');
const cors = require('cors');
const db = require('./database/connect');
const userRouter = require("./routers/user")

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

app.use("/users", userRouter);

module.exports = app