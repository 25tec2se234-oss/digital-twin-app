const request = require('supertest');
const app = require('../src/app');

describe('Genesis Digital Twin API Endpoints', () => {
    let testSessionId = 'test_sess_' + Date.now();

    it('GET /api/genesis/init should return a Digital Twin state object', async () => {
        const res = await request(app)
            .get('/api/genesis/init')
            .set('x-genesis-session-id', testSessionId);
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.twin).toBeDefined();
        expect(res.body.twin.twinId).toMatch(/^DTV-GEN-/);
        expect(res.body.twin.scores).toBeDefined();
    });

    it('POST /api/genesis/init should initialize or retrieve existing twin', async () => {
        const res = await request(app)
            .post('/api/genesis/init')
            .send({ session_id: testSessionId });
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.twin).toBeDefined();
        expect(res.body.twin.twinId).toMatch(/^DTV-GEN-/);
    });

    it('POST /api/genesis/calibrate should update capability scores and archetype', async () => {
        const testScores = { logic: 95, creativity: 90, velocity: 88, domain: 92, grit: 94 };
        const res = await request(app)
            .post('/api/genesis/calibrate')
            .set('x-genesis-session-id', testSessionId)
            .send({
                session_id: testSessionId,
                scores: testScores,
                archetype: 'The Visionary Architect',
                confidence: 96.5
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.twin).toBeDefined();
        expect(res.body.twin.scores.logic).toEqual(95);
        expect(res.body.twin.archetype).toEqual('The Visionary Architect');
    });

    it('POST /api/genesis/calibrate should reject request missing scores', async () => {
        const res = await request(app)
            .post('/api/genesis/calibrate')
            .set('x-genesis-session-id', testSessionId)
            .send({ session_id: testSessionId });

        expect(res.statusCode).toEqual(400);
        expect(res.body.success).toBe(false);
    });
});
