require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

// Import Level 2 routes
const Level2Routes = require('./routers/Level2Routes')

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../frontend')));

/*
// Temporary middleware to simulate authentication (until auth team finishes)
app.use('/api/levels', (req, res, next) => {
    req.user = {
        id: 1 // This will be the test user ID
    };
    next();
});
*/

//level 2 app route
app.use('/app', Level2Routes)


// Health check endpoint
app.get('/app/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        message: 'SyntaxSchoolers API is running',
        timestamp: new Date().toISOString()
    });
});

// Serve frontend pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/homepage/homepage.html'));
});




module.exports = app;