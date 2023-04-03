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
            return done(null, false, { message: 'email not found.' });
        }
        const passwordIsValid = await user.isValidPassword(password);
        if (!passwordIsValid) {
            return done(null, false, { message: 'password is invalid.' });
        }

        return done(null, user, { message: 'login successful.' });
    } catch (error) {
        return done(error);
    }
});

passport.use(strategy);
passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser(async(email, done) => {
    UserModel.findOne({ email: email })
        .then(user => {
            done(null, user);
        });
});