const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const UserModel = require('../models/User.js');

const localOptions = {
    usernameField: 'email',
    passwordField: 'password'
};

const strategy = new LocalStrategy(localOptions, async(email, password, done) => {
    try {
        const user = await UserModel.findOne({ email: email });
        if (!user) {
            return done(null, false, { message: 'Email not found.' });
        }
        const passwordIsValid = await user.isValidPassword(password);
        if (!passwordIsValid) {
            return done(null, false, { message: 'Password is invalid.' });
        }

        return done(null, user, { message: 'login successful.' });
    } catch (error) {
        console.log(error)
        return done(error);
    }
});

passport.use('localLogin', strategy);

passport.serializeUser((user, done) => {
    done(null, user.email)
});

passport.deserializeUser((email, done) => {
    UserModel.findOne({ email: email })
        .then((user) => {
            done(null, user)
        });
});