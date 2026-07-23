const userModel = require('../models/userModel');

async function incrementStreak(req, res, next) {
  try {
    const userId = req.user.id;
    const appData = await userModel.getAppData(userId);
    
    // Initialize streak object if it doesn't exist
    if (!appData.streak) {
      appData.streak = {
        current: 0,
        best: 0,
        lastActive: null
      };
    }

    const today = new Date().toDateString();
    
    // If they already incremented today, do nothing but return current streak
    if (appData.streak.lastActive === today) {
      return res.status(200).json({ 
        message: 'Already claimed today', 
        streak: appData.streak.current, 
        bestStreak: appData.streak.best 
      });
    }

    // Check if the streak was broken (last active was before yesterday)
    let currentStreak = parseInt(appData.streak.current || '0', 10);
    let bestStreak = parseInt(appData.streak.best || '0', 10);
    const lastActive = appData.streak.lastActive;

    if (lastActive) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastActive !== yesterday.toDateString()) {
        // Streak is broken
        currentStreak = 0;
      }
    }

    // Increment
    currentStreak += 1;
    if (currentStreak > bestStreak) {
      bestStreak = currentStreak;
    }

    appData.streak.current = currentStreak;
    appData.streak.best = bestStreak;
    appData.streak.lastActive = today;

    await userModel.saveAppData(userId, appData);

    return res.status(200).json({ 
      message: 'Streak incremented', 
      streak: currentStreak, 
      bestStreak: bestStreak 
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  incrementStreak
};
