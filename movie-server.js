require('dotenv').config()
const express = require('express')
const app = express()

app.use(express.static('public'))
app.use('/static', express.static('public'))

const Movie = require('./models/Movie.js')

app.use(express.urlencoded({ extended: true }))

const movieRouter = require('./handlers/movieRouter.js')
movieRouter.handleAllMovies(app, Movie)
movieRouter.handleMovieById(app, Movie)
movieRouter.handleMoviesByYear(app, Movie)

require('./handlers/dataConnector.js').connect()
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})