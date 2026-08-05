const userModel = require('../models/userModel');

async function incrementStreak(req, res, next) {
  try {
    const userId = req.user.id;
    const { clientStreak, clientBest, clientLastActive, clientToday } = req.body || {};
    const appData = await userModel.getAppData(userId);
    
    // Initialize streak object if it doesn't exist (new user/first time setup)
    if (!appData.streak) {
      appData.streak = {
        current: clientStreak ? parseInt(clientStreak, 10) : 0,
        best: clientBest ? parseInt(clientBest, 10) : 0,
        lastActive: clientLastActive || null
      };
    } else {
      // Safe migration for best streak if frontend somehow has a better score initially
      const safeClientBest = clientBest ? parseInt(clientBest, 10) : 0;
      appData.streak.best = Math.max(appData.streak.best || 0, safeClientBest);
    }

    // Rely on the frontend's local date string to avoid UTC midnight breakage
    const today = clientToday || new Date().toDateString();
    
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
      // Use the 'today' string parsed as a Date to correctly represent 'yesterday' relative to the client's today
      const todayDate = clientToday ? new Date(clientToday) : new Date();
      const yesterday = new Date(todayDate);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const dayBeforeYesterday = new Date(todayDate);
      dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);

      if (lastActive !== yesterday.toDateString() && lastActive !== dayBeforeYesterday.toDateString()) {
        // Streak is broken! Check if they have a streak freeze shield
        if (appData.streakShields && appData.streakShields > 0) {
          appData.streakShields -= 1;
          // Protect the streak by setting lastActive to yesterday, so it increments to today
          appData.streak.lastActive = yesterday.toDateString();
        } else {
          currentStreak = 0;
        }
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
      bestStreak: bestStreak,
      streakShields: appData.streakShields
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  incrementStreak
};
