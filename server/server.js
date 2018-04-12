'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const server = express();

server.use(bodyParser.json());
server.use(cookieParser());

module.exports = server;
