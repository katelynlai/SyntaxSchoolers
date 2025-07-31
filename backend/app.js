require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

// Import Level 1 routes
const levelRoutes = require('./routers/level1Routes');
// Import Staff routes
const staffRoutes = require('./routers/staffRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        message: 'SyntaxSchoolers API is running'
        });
});

// Temporary middleware to simulate authentication (until auth team finishes)
app.use('/api/levels', (req, res, next) => {
    req.user = {
        id: 1 
    };
    next();
});

// Level 1 Routes
app.use('/api/levels', levelRoutes);

// Staff Routes for teachers (CRUD operations)
app.use('/api/staff', staffRoutes);

// Frontend pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/homepage.html'));
});

app.get('/level1', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/level1/level1.html'));
});

app.get('/level2', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/level2.html'));
});

app.get('/staff', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/staff_dashboard/staff_dashboard.html'));
});

app.get('/level3', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/level3.html'));
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({ 
        error: 'API endpoint not found',
        path: req.originalUrl 
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Error:', error);
    
    res.status(error.status || 500).json({
        error: error.message || 'Internal Server Error'
    });
});

module.exports = app;