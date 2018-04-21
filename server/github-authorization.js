'use strict';

const passport = require('passport');
const passportGithub = require('passport-github');
const User = require('./models/User');

const URL = `${process.env.HOST}:${process.env.PORT}`;

const strategy = new passportGithub.Strategy(
    {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: `${URL}/login/return`
    },

    /* eslint max-params: ["error", 4] */
    async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await User.findOrCreate({ nickname: profile.username });

            done(null, user);
        } catch (err) {
            done(err);
        }
    }
);

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findOne({ _id: id });

        done(null, user);
    } catch (err) {
        done(err);
    }
});

passport.use(strategy);

module.exports = passport;
