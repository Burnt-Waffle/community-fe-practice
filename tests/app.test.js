const request = require('supertest');
const app = require('./app');
const axios = require('axios');

jest.mock('axios');

describe('Express Server Test', () => {
    it('Tomcat 서버가 데이터를 주면 Express도 잘 응답해야 한다', async () => {
        const mockData = { id: 1, name: 'TomcatUser' };
        axios.get.mockResolvedValue({ data: mockData });

        const res = await request(app).get('/api/user');

        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe('TomcatUser');

        expect(axios.get).toHaveBeenCalled();
    })
})