'use strict';

module.exports = server => {
    // Назначаем обработчики для запросов к «API»
    server
        .get('/api', (req, res) => {
            res.send({ message: "hello" })
        });
};