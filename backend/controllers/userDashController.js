const UserDashModel = require('../models/userDash');

const getUserProgress = async (req, res) => {
  const userId = 1;

  try {
    const progress = await UserDashModel.getUserProgress(userId);

    if (!progress) {
      return res.status(404).json({ error: 'User progress not found' });
    }

    res.status(200).json(progress);
  } catch (error) {
    console.error('Error fetching user progress:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


module.exports = {
    getUserProgress
}    
