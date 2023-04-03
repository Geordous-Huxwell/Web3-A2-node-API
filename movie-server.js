require('dotenv').config()
const express = require('express')
const app = express()
const ejs = require('ejs')

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use('/static', express.static('public'))

const Movie = require('./models/Movie.js')
const User = require('./models/User.js')

app.use(express.urlencoded({ extended: true }))

const movieRouter = require('./handlers/movieRouter.js')
movieRouter.handleAllMovies(app, Movie)
movieRouter.handleMovieById(app, Movie)
movieRouter.handleMoviesByYear(app, Movie)
movieRouter.handleMoviesWithLimit(app, Movie)
movieRouter.handleMoviesByTmdbId(app, Movie)
movieRouter.handleMoviesByRatings(app, Movie)
movieRouter.handleMoviesByGenre(app, Movie)
movieRouter.handleMoviesByTitle(app, Movie)
movieRouter.handleLoginPage(app, User)

require('./handlers/dataConnector.js').connect()
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})