const Level3 = require('../models/Level3'); // adjust filename if different

async function getRandomSentence(req, res) {
  try {
    const sentence = await Level3.getRandomSentence();
    if (!sentence) {
      return res.status(404).json({ error: 'No sentence found' });
    }
    res.json({
      sentence_id: sentence.sentence_id,
      english: sentence.english,
      shuffled: sentence.shuffled,
      category_id: sentence.category_id
    });
  } catch (err) {
    console.error('Error in getRandomSentence:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function submitSentence(req, res) {
    try {
      const { sentenceId, sentence } = req.body; // sentence is an array of words
  
      if (!sentenceId || !Array.isArray(sentence)) {
        return res.status(400).json({ error: 'Invalid request body' });
      }
  
      // Fetch the correct sentence from DB
      const correctSentence = await Level3.getSentenceById(sentenceId);
      if (!correctSentence) {
        return res.status(404).json({ error: 'Sentence not found' });
      }
  
      // Compare user submitted sentence to correct answer (French)
      // correctSentence.french is a string, split it into words
      const correctWords = correctSentence.french.trim().split(/\s+/);
  
      // Check if arrays match (exact order)
      const isCorrect = sentence.length === correctWords.length &&
                        sentence.every((word, i) => word === correctWords[i]);
  
      res.json({ correct: isCorrect });
    } catch (error) {
      console.error('Error in submitSentence:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

module.exports = {
  getRandomSentence,
  submitSentence,
};
