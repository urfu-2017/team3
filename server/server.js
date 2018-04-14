'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const server = express();

server.use(cors());
server.use(bodyParser.json());
server.use(cookieParser());

module.exports = server;
