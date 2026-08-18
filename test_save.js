const fetch = require('node-fetch'); // If not available, I'll use http module
// wait, fetch is built-in in node v20+. I'll just use global fetch.

async function run() {
  try {
    const res = await fetch('http://localhost:3000/api/futureverse/progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Need a valid token. I'll mock a user or just pass a valid JWT.
      },
      body: JSON.stringify({
        level: 5,
        xp: 100,
        mastery: 10,
        exploredNodes: ['node1'],
        exploredWorlds: ['world1'],
        completedChallenges: [],
        stats: {},
        difficultyMultiplier: 1.0,
        hasSeenGuide: true
      })
    });
    console.log("Status:", res.status);
    console.log("Response:", await res.text());
  } catch (err) {
    console.error(err);
  }
}
run();
