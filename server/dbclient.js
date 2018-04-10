'use strict';

const headers = { 'Authorization': process.env.DATABASE_API_TOKEN };
const dbUrl = process.env.DATABASE_API_URL;

const url = require('url');
const nodeFetch = require('node-fetch');
const querystring = require('querystring');

const numberOfRetryRequest = 3;

async function fetch(requestUrl, options) {
    let response = null;

    for (let i = 0; i <= numberOfRetryRequest; i += 1) {
        response = await nodeFetch(requestUrl, options);

        if (response.status >= 200 && response.status < 300) {
            return response;
        }
    }

    return response;
}

function put(key, value) {
    const putHeaders = Object.assign({ 'Content-Type': 'plain/text' }, headers);

    return fetch(`${dbUrl}/${key}`, {
        method: 'PUT',
        headers: putHeaders,
        body: value
    });
}
function post(key, value) {
    const postHeaders = Object.assign({ 'Content-Type': 'plain/text' }, headers);

    return fetch(`${dbUrl}/${key}`, {
        method: 'POST',
        headers: postHeaders,
        body: value
    });
}

function postJson(key, value) {
    return post(key, JSON.stringify(value));
}

function getLast(key) {
    fetch(`${dbUrl}/${key}`, {
        method: 'GET',
        headers
    }).then(resp => JSON.parse(resp.text()));
}

async function getAll(key, options) {
    const getAllUrl = url.parse(`${dbUrl}/${key}/all`);

    getAllUrl.search = querystring.stringify(options);
    const response = await fetch(getAllUrl, {
        method: 'GET',
        headers
    });

    const values = await response.json();

    return values.map(JSON.parse);
}

function deleteByKey(key) {
    fetch(`${dbUrl}/${key}`, {
        method: 'DELETE',
        headers
    });
}

module.exports = { put, post, postJson, getAll, getLast, deleteByKey };
