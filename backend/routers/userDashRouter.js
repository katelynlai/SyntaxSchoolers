const express = require('express');
const router = express.Router();
const userDashController = require('../controllers/userDashController');

// GET /api/progress/:userId
router.get('/:userId', userDashController.getUserProgress);

module.exports = router;
