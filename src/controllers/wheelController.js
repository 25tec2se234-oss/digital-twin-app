const { pool } = require('../db');

const REWARDS = [
  { id: "streak", title: "STREAK SAVER", weight: 6, label: "Streak Saver" },
  { id: "tour", title: "VIRTUAL TOUR", weight: 3.9, label: "Virtual Tour of DTV" },
  { id: "extraspin", title: "EXTRA SPIN", weight: 12, label: "Extra Spin" },
  { id: "luck", title: "BETTER LUCK", weight: 33, label: "Better Luck Next Time" },
  { id: "mentor1w", title: "1 WEEK MENTORSHIP", weight: 0.1, label: "1 Week Free Mentorship" },
  { id: "try", title: "TRY AGAIN", weight: 45, label: "Try Again Tomorrow" },
];

// In-memory fallback map for active backend session persistence
const inMemoryWheelMap = new Map();

function getTodayString() {
  const now = new Date();
  // IST is UTC+5:30 -> 5.5 hours -> 19800000 milliseconds
  const istDate = new Date(now.getTime() + 19800000);
  const year = istDate.getUTCFullYear();
  const month = String(istDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(istDate.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function pickWeightedIndex() {
  const total = REWARDS.reduce((sum, r) => sum + r.weight, 0);
  let roll = Math.random() * total;
  for (let i = 0; i < REWARDS.length; i++) {
    roll -= REWARDS[i].weight;
    if (roll <= 0) return i;
  }
  return 5;
}

function getMemoryState(key, today) {
  let mem = inMemoryWheelMap.get(key);
  if (!mem || mem.lastSpinDate !== today) {
    mem = {
      lastSpinDate: today,
      spinsToday: 0,
      extraSpinsRemaining: 0,
      claimedRewards: []
    };
    inMemoryWheelMap.set(key, mem);
  }
  return mem;
}

async function getWheelState(req, res) {
  try {
    const today = getTodayString();
    const userId = req.user ? req.user.id : null;
    const clientKey = userId ? `user_${userId}` : `ip_${req.ip || '127.0.0.1'}`;
    const memState = getMemoryState(clientKey, today);

    let dbState = null;
    if (userId) {
      const result = await pool.query(
        'SELECT wheel_state FROM user_data WHERE user_id = $1',
        [userId]
      ).catch(() => ({ rows: [] }));

      if (result.rows.length > 0 && result.rows[0].wheel_state) {
        dbState = result.rows[0].wheel_state;
        if (dbState.lastSpinDate !== today) {
          dbState.lastSpinDate = today;
          dbState.spinsToday = 0;
        }
      }
    }

    // Merge in-memory and db state so spinsToday is NEVER downgraded to 0
    const finalSpinsToday = Math.max(
      memState.spinsToday || 0,
      dbState ? (dbState.spinsToday || 0) : 0
    );

    const finalExtraSpins = Math.max(
      memState.extraSpinsRemaining || 0,
      dbState ? (dbState.extraSpinsRemaining || 0) : 0
    );

    const mergedState = {
      lastSpinDate: today,
      spinsToday: finalSpinsToday,
      extraSpinsRemaining: finalExtraSpins,
      claimedRewards: dbState ? dbState.claimedRewards : memState.claimedRewards
    };

    inMemoryWheelMap.set(clientKey, mergedState);

    const freeDailyRemaining = Math.max(0, 1 - mergedState.spinsToday);
    const totalRemaining = freeDailyRemaining + mergedState.extraSpinsRemaining;

    return res.json({
      success: true,
      lastSpinDate: mergedState.lastSpinDate,
      spinsToday: mergedState.spinsToday,
      extraSpinsRemaining: mergedState.extraSpinsRemaining,
      remainingSpins: totalRemaining,
      claimedRewards: mergedState.claimedRewards || []
    });
  } catch (error) {
    console.error('[WheelController] getWheelState error:', error);
    return res.status(500).json({ error: 'InternalServerError', message: 'Failed to retrieve wheel state' });
  }
}

async function spinWheel(req, res) {
  let client = null;
  try {
    const today = getTodayString();
    const userId = req.user ? req.user.id : null;
    const clientKey = userId ? `user_${userId}` : `ip_${req.ip || '127.0.0.1'}`;

    const memState = getMemoryState(clientKey, today);
    const currentState = JSON.parse(JSON.stringify(memState));

    if (userId) {
      client = await pool.connect();
      await client.query('BEGIN');
      
      const result = await client.query(
        'SELECT wheel_state FROM user_data WHERE user_id = $1 FOR UPDATE',
        [userId]
      ).catch(() => ({ rows: [] }));

      if (result.rows.length > 0 && result.rows[0].wheel_state) {
        const dbState = result.rows[0].wheel_state;
        if (dbState.lastSpinDate === today) {
          currentState.spinsToday = Math.max(currentState.spinsToday, dbState.spinsToday || 0);
          currentState.extraSpinsRemaining = Math.max(currentState.extraSpinsRemaining, dbState.extraSpinsRemaining || 0);
        } else {
          // Carry over extra spins if it's a new day
          currentState.spinsToday = 0;
          currentState.extraSpinsRemaining = dbState.extraSpinsRemaining || 0;
        }
        
        // Merge claimed rewards properly
        if (dbState.claimedRewards && Array.isArray(dbState.claimedRewards)) {
          currentState.claimedRewards = dbState.claimedRewards;
        }
      }
    }

    const freeDailyRemaining = Math.max(0, 1 - (currentState.spinsToday || 0));
    const totalRemaining = freeDailyRemaining + (currentState.extraSpinsRemaining || 0);

    if (totalRemaining <= 0) {
      if (client) {
        await client.query('ROLLBACK');
        client.release();
      }
      return res.status(400).json({
        error: 'DailySpinLimitReached',
        message: 'You have already used your daily spin. Please return tomorrow!'
      });
    }

    // Consume 1 spin immediately
    if (currentState.spinsToday < 1) {
      currentState.spinsToday = 1;
    } else if (currentState.extraSpinsRemaining > 0) {
      currentState.extraSpinsRemaining -= 1;
    }

    // Authoritative backend RNG selection
    const chosenIndex = pickWeightedIndex();
    const chosenReward = REWARDS[chosenIndex];
    let claimCode = null;

    if (chosenReward.id === 'extraspin') {
      currentState.extraSpinsRemaining = (currentState.extraSpinsRemaining || 0) + 1;
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

    currentState.claimedRewards = currentState.claimedRewards || [];
    currentState.claimedRewards.push(winRecord);
    inMemoryWheelMap.set(clientKey, currentState);

    if (userId && client) {
      await client.query(
        `INSERT INTO user_data (user_id, wheel_state, updated_at)
         VALUES ($1, $2, NOW())
         ON CONFLICT (user_id) DO UPDATE SET wheel_state = EXCLUDED.wheel_state, updated_at = NOW()`,
        [userId, JSON.stringify(currentState)]
      );
      await client.query('COMMIT');
      client.release();
      client = null;
    }

    const updatedFreeDaily = Math.max(0, 1 - (currentState.spinsToday || 0));
    const updatedTotalRemaining = updatedFreeDaily + (currentState.extraSpinsRemaining || 0);

    return res.json({
      success: true,
      chosenIndex,
      rewardId: chosenReward.id,
      rewardLabel: chosenReward.label,
      claimCode,
      remainingSpins: updatedTotalRemaining,
      wheelState: currentState
    });
  } catch (error) {
    if (client) {
      try { await client.query('ROLLBACK'); client.release(); } catch (e) {}
    }
    console.error('[WheelController] spinWheel error:', error);
    return res.status(500).json({ error: 'InternalServerError', message: 'Failed to process spin' });
  }
}

module.exports = {
  getWheelState,
  spinWheel
};
