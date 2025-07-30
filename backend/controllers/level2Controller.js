const Level2 = require('../models/Level2');
const ProgressL2 = require('../models/ProgressL2')


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
      const { sentenceId, answer, userId, levelId} = req.body;
  
      if (!sentenceId || !answer) {
        return res.status(400).json({ error: 'Missing sentenceId or answer' });
      }
  
      const isCorrect = await Level2.checkAnswer(sentenceId, answer);
  
      const levelStatus = await Level2.updateLevelProgress(userId, levelId, isCorrect);

        // If level is now completed, mark it in overall progress
      if (levelStatus === true) {
        await ProgressL2.markLevelComplete(userId, levelId);
      }

      res.json({ correct: isCorrect, levelStatus });
    } catch (err) {
      console.error('Error checking answer:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

module.exports = { getRandomSentence, submitSentence };
