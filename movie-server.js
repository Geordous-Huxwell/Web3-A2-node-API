require('dotenv').config()
const express = require('express')
const session = require('express-session');
const ejs = require('ejs')
const cookieParser = require('cookie-parser');
const flash = require('express-flash');
const passport = require('passport')
const helper = require('./handlers/helpers.js')

const app = express() // create an express app 

app.set('views', './views');
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use('/static', express.static('public'))


const Movie = require('./models/Movie.js')
const User = require('./models/User.js')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Express session
app.use(cookieParser('oreos'));
app.use(
    session({
        secret: process.env.SECRET,
        resave: true,
        saveUninitialized: true
    })
);
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
// use express flash, which will be used for passing messages
app.use(flash());

// set up the passport authentication
require('./handlers/auth.js')



// this is route handlers 
const movieRouter = require('./handlers/movieRouter.js')
movieRouter.handleAllMovies(app, Movie)
movieRouter.handleMovieById(app, Movie)
movieRouter.handleMoviesByYear(app, Movie)
movieRouter.handleMoviesWithLimit(app, Movie)
movieRouter.handleMoviesByTmdbId(app, Movie)
movieRouter.handleMoviesByRatings(app, Movie)
movieRouter.handleMoviesByGenre(app, Movie)
movieRouter.handleMoviesByTitle(app, Movie)
    //movieRouter.handleLoginPage(app, User)

// add site requests?
app.get('/', helper.ensureAuthenticated, (req, res) => {
    res.render('../views/home.ejs', { user: req.user });
})

// login and logout routers 
//movieRouter.handleLoginPage(app, User)

app.get('/login', helper.redirectLoggedIn, (req, res) => {
    console.log("get login")
    res.render('../index.ejs')
})
app.post('/login', async(req, resp, next) => {
    console.log("post login")
    passport.authenticate('localLogin', function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return resp.render('../index.ejs', { message: req.flash('info') });
        }
        console.log("user is " + user)
        req.logIn(user, function(err) {
            if (err) {
                return next(err);
            }
            return resp.redirect('/');
        });

        // successRedirect: '/',
        // failureRedirect: '/login',
        // failureFlash: true
    })(req, resp, next);
});
app.get('/logout', (req, resp) => {
    req.logout(function(err) {
        if (err) {
            return next(err);
        }
    });
    req.flash('info', 'your were logged out');
    resp.render('login', { message: req.flash('info') });
});



require('./handlers/dataConnector.js').connect()
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})