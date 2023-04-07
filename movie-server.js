require('dotenv').config()
const express = require('express')
const session = require('express-session');
const ejs = require('ejs')
const cookieParser = require('cookie-parser');
const flash = require('express-flash');
const passport = require('passport')
const helper = require('./handlers/helpers.js')

const app = express()

app.set('views', './views');
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use('/static', express.static('public'))

const Movie = require('./models/Movie.js')
const User = require('./models/User.js')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser('oreos'));
app.use(
    session({
        secret: process.env.SECRET,
        resave: true,
        saveUninitialized: true
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

require('./handlers/auth.js')

// movie DB route handlers 
const movieRouter = require('./handlers/movieRouter.js')
movieRouter.handleAllMovies(app, Movie)
movieRouter.handleMovieById(app, Movie)
movieRouter.handleMoviesByYear(app, Movie)
movieRouter.handleMoviesWithLimit(app, Movie)
movieRouter.handleMoviesByTmdbId(app, Movie)
movieRouter.handleMoviesByRatings(app, Movie)
movieRouter.handleMoviesByGenre(app, Movie)
movieRouter.handleMoviesByTitle(app, Movie)

// authentications routes

// serve home page if user logged in, otherwise redirect to login page
app.get('/', helper.ensureAuthenticated, (req, res) => {
    res.render('../views/home.ejs', { user: req.user });
})

// serve login page if user not logged in, otherwise redirect to home page
app.get('/login', helper.redirectLoggedIn, (req, res) => {
    res.render('../index.ejs', { message: req.flash('info') })
})

// handle login attempt
app.post('/login', async(req, resp, next) => {
    passport.authenticate('localLogin', function(err, user, info) {
        if (err) {
            return next(err);
        }
        // username/password combination not found
        if (!user) {
            req.flash('error', 'Invalid username or password');
            return resp.render('../index.ejs', { message: req.flash('error') });
        }
        req.logIn(user, function(err) {
            if (err) {
                return next(err);
            }
            return resp.redirect('/');
        });
    })(req, resp, next);
});

// handle logout 
app.get('/logout', (req, resp) => {
    req.flash('info', 'you were logged out');
    req.logout(function(err) {
        if (err) {
            return next(err);
        }
    });
    resp.render('../index.ejs', { message: req.flash('info') })
});

// run server
require('./handlers/dataConnector.js').connect()
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})