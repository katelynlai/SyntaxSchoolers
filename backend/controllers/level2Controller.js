const Level2 = require('../models/Level2');

async function getRandomSentence(req, res) {
  try {
    const sentence = await Level2.getRandomSentence(); // model function
    if (!sentence) {
      return res.status(404).json({ error: 'No sentence found' });
    }
    res.json(sentence);
  } catch (err) {
    console.error('Error fetching sentence:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function submitSentence(req, res) {
    try {
      const { sentenceId, answer } = req.body;
  
      if (!sentenceId || !answer) {
        return res.status(400).json({ error: 'Missing sentenceId or answer' });
      }
  
      const isCorrect = await Level2.checkAnswer(sentenceId, answer);
  
      res.json({ correct: isCorrect });
    } catch (err) {
      console.error('Error checking answer:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

module.exports = { getRandomSentence, submitSentence };
