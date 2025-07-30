const express = require('express');
const cors = require('cors');
const db = require('./database/connect');
const userRouter = require("./routers/user")
const path = require('path'); 
const level1Routes = require('./routers/level1Routes');

// Serve static files from the frontend directory
const app = express();

//Middleware
app.use(cors());
app.use(express.json());


app.use("/users", userRouter);
app.use("/api/levels", level1Routes);

app.use(express.static(path.join(__dirname, '../frontend')));

module.exports = app