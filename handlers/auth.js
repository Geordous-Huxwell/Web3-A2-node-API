const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const UserModel = require('../models/User.js');

const localOptions = {
    usernameField: 'email',
    passwordField: 'password'
};

const strategy = new LocalStrategy(localOptions, async(email, password, done) => {
    try {
        console.log("email", email)
        console.log("password", password)
        const user = await UserModel.findOne({ email: email });
        console.log("user", user)
        if (!user) {
            return done(null, false, { message: 'Email not found.' });
        }
        const passwordIsValid = await user.isValidPassword(password);
        if (!passwordIsValid) {
            console.log("password is invalid")
            return done(null, false, { message: 'Password is invalid.' });
        }

        return done(null, user, { message: 'login successful.' });
    } catch (error) {
        console.log("error", error.message)
        return done(error);
    }
});
console.log("strategy", strategy)
    // exporting the strategy and renaming it local login 
passport.use('localLogin', strategy);

passport.serializeUser((user, done) => {
    console.log('serialized user', user)
    done(null, user.email)
});

passport.deserializeUser((email, done) => {
    UserModel.findOne({ email: email })
        .then((user) => {
            console.log('deserialized user', user)
            done(null, user)
        });
});