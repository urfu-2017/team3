'use strict';

const createIdenticon = require('../utils/identicon');
const mongoose = require('mongoose');

const mongoSchema = new mongoose.Schema({
    _id: {
        type: String,
        alias: 'nickname'
    },
    avatar: String
}, { toJSON: { virtuals: true } });

class UserClass {
    static async findOrCreate({ nickname }) {
        const user = await this.findOne({ _id: nickname });

        return user ? user : await this.create({ nickname });
    }
}

/* eslint-disable no-invalid-this */
mongoSchema.pre('save', function () {
    this.avatar = createIdenticon();

    return this;
});

mongoSchema.loadClass(UserClass);
const User = mongoose.model('User', mongoSchema);

module.exports = User;
