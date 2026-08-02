const { pool } = require('../db');

const REWARDS = [
  { id: "streak", title: "STREAK SAVER", weight: 6, label: "Streak Saver" },
  { id: "tour", title: "VIRTUAL TOUR", weight: 3.9, label: "Virtual Tour of DTV" },
  { id: "extraspin", title: "EXTRA SPIN", weight: 12, label: "Extra Spin" },
  { id: "luck", title: "BETTER LUCK", weight: 33, label: "Better Luck Next Time" },
  { id: "mentor1w", title: "1 WEEK MENTORSHIP", weight: 0.1, label: "1 Week Free Mentorship" },
  { id: "try", title: "TRY AGAIN", weight: 45, label: "Try Again Tomorrow" },
];

function getTodayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function pickWeightedIndex() {
  const total = REWARDS.reduce((sum, r) => sum + r.weight, 0);
  let roll = Math.random() * total;
  for (let i = 0; i < REWARDS.length; i++) {
    roll -= REWARDS[i].weight;
    if (roll <= 0) return i;
  }
  return 5; // fallback to 'try'
}

async function getWheelState(req, res) {
  try {
    const userId = req.user ? req.user.id : null;
    const today = getTodayString();

    if (!userId) {
      return res.json({
        success: true,
        lastSpinDate: today,
        spinsToday: 0,
        extraSpinsRemaining: 0,
        remainingSpins: 1,
        claimedRewards: []
      });
    }

    const result = await pool.query(
      'SELECT wheel_state FROM user_data WHERE user_id = $1',
      [userId]
    ).catch(() => ({ rows: [] }));

    let wheelState = {
      lastSpinDate: today,
      spinsToday: 0,
      extraSpinsRemaining: 0,
      claimedRewards: []
    };

    if (result.rows.length > 0 && result.rows[0].wheel_state) {
      wheelState = result.rows[0].wheel_state;
      if (wheelState.lastSpinDate !== today) {
        wheelState.lastSpinDate = today;
        wheelState.spinsToday = 0;
      }
    }

    const freeDailyRemaining = Math.max(0, 1 - (wheelState.spinsToday || 0));
    const totalRemaining = freeDailyRemaining + (wheelState.extraSpinsRemaining || 0);

    return res.json({
      success: true,
      lastSpinDate: wheelState.lastSpinDate,
      spinsToday: wheelState.spinsToday || 0,
      extraSpinsRemaining: wheelState.extraSpinsRemaining || 0,
      remainingSpins: totalRemaining,
      claimedRewards: wheelState.claimedRewards || []
    });
  } catch (error) {
    console.error('[WheelController] getWheelState error:', error);
    return res.status(500).json({ error: 'InternalServerError', message: 'Failed to retrieve wheel state' });
  }
}

async function spinWheel(req, res) {
  try {
    const userId = req.user ? req.user.id : null;
    const today = getTodayString();

    let wheelState = {
      lastSpinDate: today,
      spinsToday: 0,
      extraSpinsRemaining: 0,
      claimedRewards: []
    };

    if (userId) {
      const result = await pool.query(
        'SELECT wheel_state FROM user_data WHERE user_id = $1',
        [userId]
      ).catch(() => ({ rows: [] }));

      if (result.rows.length > 0 && result.rows[0].wheel_state) {
        wheelState = result.rows[0].wheel_state;
        if (wheelState.lastSpinDate !== today) {
          wheelState.lastSpinDate = today;
          wheelState.spinsToday = 0;
        }
      }
    }

    const freeDailyRemaining = Math.max(0, 1 - (wheelState.spinsToday || 0));
    const totalRemaining = freeDailyRemaining + (wheelState.extraSpinsRemaining || 0);

    if (totalRemaining <= 0) {
      return res.status(400).json({
        error: 'DailySpinLimitReached',
        message: 'You have already used your daily spin. Please return tomorrow!'
      });
    }

    // Consume spin
    if (wheelState.spinsToday < 1) {
      wheelState.spinsToday = (wheelState.spinsToday || 0) + 1;
    } else if (wheelState.extraSpinsRemaining > 0) {
      wheelState.extraSpinsRemaining -= 1;
    }

    // Authoritative backend RNG selection
    const chosenIndex = pickWeightedIndex();
    const chosenReward = REWARDS[chosenIndex];
    let claimCode = null;

    if (chosenReward.id === 'extraspin') {
      wheelState.extraSpinsRemaining = (wheelState.extraSpinsRemaining || 0) + 1;
    } else if (chosenReward.id === 'mentor1w') {
      claimCode = `DTV-MENTOR-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    }

    const winRecord = {
      id: `win_${Date.now()}`,
      rewardId: chosenReward.id,
      rewardLabel: chosenReward.label,
      wonAt: new Date().toISOString(),
      claimCode
    };

    wheelState.claimedRewards = wheelState.claimedRewards || [];
    wheelState.claimedRewards.push(winRecord);

    if (userId) {
      await pool.query(
        `INSERT INTO user_data (user_id, wheel_state, updated_at)
         VALUES ($1, $2, NOW())
         ON CONFLICT (user_id) DO UPDATE SET wheel_state = EXCLUDED.wheel_state, updated_at = NOW()`,
        [userId, JSON.stringify(wheelState)]
      ).catch(() => {});
    }

    const updatedFreeDaily = Math.max(0, 1 - (wheelState.spinsToday || 0));
    const updatedTotalRemaining = updatedFreeDaily + (wheelState.extraSpinsRemaining || 0);

    return res.json({
      success: true,
      chosenIndex,
      rewardId: chosenReward.id,
      rewardLabel: chosenReward.label,
      claimCode,
      remainingSpins: updatedTotalRemaining,
      wheelState
    });
  } catch (error) {
    console.error('[WheelController] spinWheel error:', error);
    return res.status(500).json({ error: 'InternalServerError', message: 'Failed to process spin' });
  }
}

module.exports = {
  getWheelState,
  spinWheel
};
