'use strict';

const createIdenticon = require('../utils/identicon');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary');

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

        if (user) {
            return user;
        }

        const avatarInBase64 = createIdenticon();
        const response = await this._uploadAvatar(avatarInBase64, nickname);

        return await this.create({ nickname, avatar: response.secure_url });
    }

    static _uploadAvatar(avatarInBase64, nickname) {
        const content = `data:image/png;base64,${avatarInBase64}`;

        return cloudinary.v2.uploader.upload(content, { 'public_id': `${nickname}_profile` });
    }
}

mongoSchema.loadClass(UserClass);
const User = mongoose.model('User', mongoSchema);

module.exports = User;
