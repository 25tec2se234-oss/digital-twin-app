# Fix Study Streak Reset Bug

The user reported that their 'Study Streak' and 'Best Streak' randomly reset to 0. After investigation, two critical issues were found:

## Issue 1: Timezone Mismatch
The backend calculates `today` and `yesterday` using UTC (`new Date().toDateString()`). If a user in India clicks 'Mark Today Complete' late at night, the backend might record it as the previous day. The next time they log in, the backend evaluates the streak as broken because the UTC dates do not align with the user's local actions.

## Issue 2: Dangerous Re-initialization Logic (The Best Streak Wiper)
In `streakController.js`, there is a condition intended for legacy migrations that overwrites the entire backend streak object with the client's data. If a user's streak naturally breaks, but they had clicked the button while offline (so frontend `clientStreak = 1`), this condition triggers. If the user was on a new device or cleared local storage, `clientBest` would be 0, completely wiping out their historical `bestStreak` (e.g., from 50 down to 0).

## Proposed Changes

### [MODIFY] src/controllers/streakController.js
- Remove the dangerous `appData.streak.current === 0 && clientStreak > 0` condition. Migration logic should only trigger if `!appData.streak` (new user/first time setup).
- Safely compute `Math.max(appData.streak.best || 0, clientBest)` instead of blindly overwriting.
- Accept `clientToday` from the frontend request body to ensure timezone-accurate streak tracking. Use the server's UTC date only as a fallback.

### [MODIFY] public/app.js
- Update `window.incrementStreak` to include `clientToday: today` in the POST request body so the backend can sync with the user's local timezone.

## User Review Required
No breaking changes. Please review this plan so I can proceed with the execution.
