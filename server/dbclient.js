'use strict';

const url = require('url');
const nodeFetch = require('node-fetch');
const querystring = require('querystring');

const headers = { 'Authorization': process.env.DATABASE_API_TOKEN };
const DB_URL = process.env.DATABASE_API_URL;
const NUMBER_OF_REQUEST_ATTEMPTS = 3;
const REQUEST_TIMEOUT = 3000;

/* eslint-disable-next-line complexity */
async function fetch(requestUrl, options) {
    /* eslint-disable max-depth */
    let response = null;

    options.timeout = options.timeout || REQUEST_TIMEOUT;
    for (let i = 0; i < NUMBER_OF_REQUEST_ATTEMPTS; i += 1) {
        try {
            response = await nodeFetch(requestUrl, options);

            if (response.status === 404) {
                return response;
            }

            if (response.status >= 200 && response.status < 300) {
                return response;
            }
        } catch (e) {
            // Ignore fetch timeout because hrudb
        }
    }

    return response;
}

function put(key, value) {
    const putHeaders = Object.assign({ 'Content-Type': 'plain/text' }, headers);

    return fetch(`${DB_URL}/${key}`, {
        method: 'PUT',
        headers: putHeaders,
        body: value
    });
}
function post(key, value) {
    const postHeaders = Object.assign({ 'Content-Type': 'plain/text' }, headers);

    return fetch(`${DB_URL}/${key}`, {
        method: 'POST',
        headers: postHeaders,
        body: value
    });
}

function postJson(key, value) {
    return post(key, JSON.stringify(value));
}

function getLast(key) {
    return fetch(`${DB_URL}/${key}`, {
        method: 'GET',
        headers
    });
}

async function getAll(key, options) {
    const getAllUrl = url.parse(`${DB_URL}/${key}/all`);

    getAllUrl.search = querystring.stringify(options);
    const response = await fetch(getAllUrl, {
        method: 'GET',
        headers
    });

    const values = await response.json();

    return values.map(JSON.parse);
}

function deleteByKey(key) {
    return fetch(`${DB_URL}/${key}`, {
        method: 'DELETE',
        headers
    });
}

module.exports = { put, post, postJson, getAll, getLast, deleteByKey };
