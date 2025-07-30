const express = require('express');
const router = express.Router();
const SimpleLevelController = require('../controllers/level1Controller');

// Simple Level 1 Routes
router.post('/1/start', SimpleLevelController.startLevel1);     // Get questions
router.post('/1/submit', SimpleLevelController.submitLevel1);   // Submit all answers
router.get('/1/progress', SimpleLevelController.getLevel1Progress); // Get saved progress

module.exports = router;