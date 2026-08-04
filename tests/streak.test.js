const request = require('supertest');
const app = require('../src/app');

describe('Streak Controller & API', function() {
  let accessToken;

  beforeAll(async function() {
    const uniqueEmail = `streak.user_${Date.now()}@example.com`;
    const signup = await request(app)
      .post('/api/v1/auth/signup')
      .send({ email: uniqueEmail, password: 'StrongPass!123', name: 'Streak Test User' });
    
    accessToken = signup.body.accessToken;
  });

  it('initializes streak on first call', async function() {
    const today = new Date().toDateString();
    const res = await request(app)
      .post('/api/v1/users/streak/increment')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        clientStreak: 0,
        clientBest: 5,
        clientLastActive: null,
        clientToday: today
      });

    expect(res.status).toBe(200);
    expect(res.body.streak).toBe(1);
    expect(res.body.bestStreak).toBe(5);
  });

  it('returns already claimed if called again on the same day', async function() {
    const today = new Date().toDateString();
    const res = await request(app)
      .post('/api/v1/users/streak/increment')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        clientStreak: 1,
        clientBest: 5,
        clientToday: today
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Already claimed today');
    expect(res.body.streak).toBe(1);
    expect(res.body.bestStreak).toBe(5);
  });

  it('increments streak on consecutive day without resetting best streak', async function() {
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrow = tomorrowDate.toDateString();

    const res = await request(app)
      .post('/api/v1/users/streak/increment')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        clientStreak: 1,
        clientBest: 0, // Even if client sends 0, bestStreak must NOT be wiped!
        clientToday: tomorrow
      });

    expect(res.status).toBe(200);
    expect(res.body.streak).toBe(2);
    expect(res.body.bestStreak).toBe(5);
  });

  it('resets streak if more than 1 day skipped (and no shields)', async function() {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 5);
    const futureDay = futureDate.toDateString();

    const res = await request(app)
      .post('/api/v1/users/streak/increment')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        clientStreak: 2,
        clientBest: 0,
        clientToday: futureDay
      });

    expect(res.status).toBe(200);
    expect(res.body.streak).toBe(1);
    expect(res.body.bestStreak).toBe(5); // Historical best preserved!
  });
});
