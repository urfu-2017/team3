require('dotenv').config();

const request = require('supertest');
const utils = require('./testHelpers');
const mongoose = require('mongoose');

const server = utils.setupServer('user_1');

mongoose.connect(process.env.DATABASE_CONNECTION_STRING);

describe('fillDb', () => {
    const userNames = ['john', 'george', 'paul', 'ringo'];

    it('create users', async () => {
        for (const userName of userNames) {
            await request(server).post(`/api/users/${userName}`)
                .expect(200);
        }
    });

    it('create private chats', async () => {
        for (let i = 0; i < userNames.length - 1; i += 1) {
            await request(server).post('/api/chats')
                .send({
                    type: 'private',
                    members: [userNames[i], userNames[i + 1]],
                    title: `someBeatles${i}`
                })
                .expect(200);
        }
    });

    it('create group chats', async () => {
        await request(server).post('/api/chats')
            .send({ type: 'group', members: userNames, title: 'theBeatles', inviteId: 'Beatles' })
            .expect(200);
    });
});
