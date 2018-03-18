'use strict';

const headers = { 'Authorization': process.env.DATABASE_API_TOKEN };
const dbUrl = process.env.DATABASE_API_URL;

const url = require('url');
const fetch = require('node-fetch');

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

function getAll(key, options) {
    const getAllUrl = url.parse(`${dbUrl}/${key}/all`);

    getAllUrl.query = options;
    url.format(getAllUrl);

    return fetch(dbUrl, {
        method: 'GET',
        headers
    }).then(resp => resp.json().map(JSON.parse));
}

function deleteByKey(key) {
    fetch(`${dbUrl}/${key}`, {
        method: 'DELETE',
        headers
    });
}

module.exports = { put, post, postJson, getAll, getLast, deleteByKey };
