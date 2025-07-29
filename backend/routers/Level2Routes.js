const express = require('express');
const router = express.Router();
const Level2Controller = require('../controllers/level2Controller');

router.get('/2/question', Level2Controller.getLevel2Question); // Get one question


module.exports = router;