'use strict';

const dbclient = require('../dbclient');

exports.getChats = (req, res) => {
    dbclient.getAll()
}

exports.getMessage = (req, res) => {
    dbclient.getAll()
}

exports.createMessage = (req, res) => {
    dbclient.post()
}

exports.getUser = (req, res) => {
    dbclient.getAll()
}

exports.createChat = (req, res) => {
    dbclient.post()
}

exports.createUser = (req, res) => {
    dbclient.post()
}