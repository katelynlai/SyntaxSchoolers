const express = require('express');
const router = express.Router();
const level3Controller = require('../controllers/level3Controller');

router.get('/sentence', level3Controller.getRandomSentence);
//get the random sentence

router.post('/sentence/submit-sentence', level3Controller.submitSentence);


module.exports = router;