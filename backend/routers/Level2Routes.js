const express = require('express');
const router = express.Router();
const Level2Controller = require('../controllers/level2Controller');

router.get('/level2/random', Level2Controller.getRandomSentence);
router.post('/level2/check', Level2Controller.submitSentence);


module.exports = router;