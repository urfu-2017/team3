'use strict';

const passport = require('passport');
const passportGithub = require('passport-github');
const fetch = require('node-fetch');
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
            const user = await User.findOrCreate(profile);

            done(null, user);
        } catch (err) {
            done(err);
        }
    }
);

passport.serializeUser((profile, done) => {
    done(null, profile.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const response = await fetch(`${URL}/api/users/${id}`);
        const user = await response.json();

        done(null, user);
    } catch (err) {
        done(err);
    }
});

passport.use(strategy);

module.exports = passport;
