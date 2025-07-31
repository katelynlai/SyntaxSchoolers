const express = require('express');
const cors = require('cors');
const db = require('./database/connect');
const userRouter = require("./routers/user")
const path = require('path'); 

//Import Level routes
const level1Routes = require('./routers/level1Routes');
const Level2Routes = require('./routers/Level2Routes')

// Serve static files from the frontend directory
const app = express();

//Middleware
app.use(cors());
app.use(express.json());


app.use("/users", userRouter);

//level 1 app route
app.use("/api/levels", level1Routes);

//level 2 app route
app.use('/app', Level2Routes)

app.use(express.static(path.join(__dirname, '../frontend')));

module.exports = app