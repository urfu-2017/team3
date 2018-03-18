'use strict';

module.exports = server => {
    // Назначаем обработчики для запросов к «API»
    server
        .get('/api', (req, res) => {
<<<<<<< HEAD
            res.send({ message: "hello" })
        });
};
=======
            res.send({ message: 'hello' });
        });
};
>>>>>>> add eslint
