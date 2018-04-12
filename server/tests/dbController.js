require('dotenv').config();

const db = require('../dbclient');
const request = require('supertest');

require('should');

const setupApiRoutes = require('../routes/api');
const server = require('../server');

setupServer(server);
let currentUserId = 0;

describe('messanger API tests', () => {
    beforeEach(async () => {
        await Promise.all([
            db.deleteByKey('users'),
            db.deleteByKey('user_1_chats'),
            db.deleteByKey('user_2_chats'),
            db.deleteByKey('user_3_chats')
        ]);
    });

    it('create chat and get chat for both users', async () => {
        await createUser(1);
        await createUser(2);

        currentUserId = 1; // Запрос от пользователя '1' на создание чата
        await createChat('my first chat', 2);

        currentUserId = 1; // Получение чатов пользователя '1'
        await request(server)
            .get('/api/chats')
            .expect(res => {
                res.body.should.have.length(1);
                res.body[0].should.have.properties({
                    title: 'my first chat'
                });
            });

        currentUserId = 2; // Получение чатов пользователя '2'
        await request(server)
            .get('/api/chats')
            .expect(res => {
                res.body.should.have.length(1);
                res.body[0].should.have.properties({
                    title: 'usernick1'
                });
            });
    });

    it('create many chats and get them', async () => {
        await createUser(2);
        await createUser(3);

        currentUserId = 3;
        await Promise.all([
            createChat('first', 2),
            createChat('second', 2),
            createChat('third', 2)
        ]);

        await request(server)
            .get('/api/chats')
            .expect(res => {
                res.body.should.have.length(3);
            });
    });
});

async function createUser(id) {
    await request(server)
        .post('/api/users')
        .send(generateUser(id))
        .expect(204);
}

async function createChat(title, interlocutorId) {
    await request(server)
        .post('/api/chats')
        .send({
            title,
            interlocutorId
        })
        .expect(201);
}

function generateUser(id) {
    return {
        id: id.toString(),
        nickname: `usernick${id}`,
        avatar: 'no'
    };
}

function setupServer(s) {
    s.use((req, res, next) => {
        req.user = generateUser(currentUserId);
        next();
    });

    setupApiRoutes(s);
    s.listen(8080);

    return s;
}
