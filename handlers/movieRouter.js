const helper = require('./helpers.js');

/**This function gets all the movies from api
 * 
 * @param {*} app 
 * @param {*} Movie 
 */
const handleAllMovies = (app, Movie) => {
        app.get('/movies', helper.ensureAuthenticated, (req, res) => {
            Movie.find()
                .then((movies) => {
                    res.status(200).json(movies)
                })
                .catch((err) => {
                    res.status(500).json(err)
                })
        })
    }
    /** This function is getting a movie from the api based on a given movie id, while still 
     *  ensuring that the user is authenticated 
     * 
     * @param {} app 
     * @param {*} Movie 
     */
const handleMovieById = (app, Movie) => {
        app.get('/movies/:id', helper.ensureAuthenticated, (req, res) => {
            Movie.find({ id: req.params.id })
                .then((movie) => {
                    if (movie.length === 0) {
                        res.status(500).json(`No movie found matching ID ${req.params.id}`)
                    } else {
                        res.status(200).json(movie)
                    }
                })
                .catch((err) => {
                    res.status(500).json(`No movie found matching ID ${req.params.id}`)
                })
        })
    }
    /** This function gets all the movies from api based on a given year range,
     *  to an authenticated user. Input is also validated. 
     * 
     * @param {} app 
     * @param {*} Movie 
     */
const handleMoviesByYear = (app, Movie) => {
    app.get('/movies/year/:min/:max', helper.ensureAuthenticated, async(req, res) => {
        const moviesInRange = []
        const minYear = parseInt(req.params.min)
        const maxYear = parseInt(req.params.max)
        if (minYear > maxYear) {
            res.status(500).json(`Invalid range. Min year (${req.params.min}) is greater than max year (${req.params.max}).`)
        }
        // loop through the year range and get the movies for each year
        for (let searchYear = minYear; searchYear <= maxYear; searchYear++) {
            const movies = await Movie.find({ release_date: new RegExp(`^${searchYear}`) })
            moviesInRange.push(...movies)

            // if we are at the last year, send the response (i.e. found movies)
            if (searchYear === maxYear) {
                if (moviesInRange.length === 0) {
                    res.status(500).json(`No movies found between ${req.params.min} and ${req.params.max}`)
                } else {
                    res.status(200).json(moviesInRange)
                }
            }
        }
    })
}

/**
 * this function gets movies up to a given limit. 
 * @param {*} app 
 * @param {*} Movie 
 */
const handleMoviesWithLimit = (app, Movie) => {
    app.get('/movies/limit/:num', helper.ensureAuthenticated, (req, resp) => {
        // set the initiial limit 
        const limit = parseInt(req.params.num);
        if (200 < limit || limit <= 0) {
            resp.status(200).json(`Invalid Amount. Limit must be between 1 and 200`);
        } else {
            Movie.find()
                .limit(limit)
                .then((data) => {
                    resp.status(200).json(data);
                })
                .catch((err) => {
                    resp.status(500).json({ message: "Unable to connect to movies handle movies with limits " })
                })
        }

    })
}



/**
 * returns movie data based on a tmbd_id matching the provided id 
 * @param {*} app 
 * @param {*} Movie 
 */
const handleMoviesByTmdbId = (app, Movie) => {
    app.get('/movies/tmdb/:id', helper.ensureAuthenticated, (req, resp) => {
        Movie.find({ tmdb_id: req.params.id })
            .then((data) => {
                if (data.length == 0) {
                    resp.status(500).json(`No movie found matching TMDB ID ${req.params.id }`)
                } else {
                    resp.status(200).json(data)
                }
            })
            .catch((err) => {
                resp.status(500).json({ message: "Unable to connect to movies database." })
            })
    })
}


/**
 * Returns movies based on a provided average rating range. if min is larger then max return error message
 * @param {*} app 
 * @param {*} Movie 
 */
const handleMoviesByRatings = (app, Movie) => {
        app.get('/movies/ratings/:min/:max', helper.ensureAuthenticated, async(req, resp) => {

            const min = parseInt(req.params.min)
            const max = parseInt(req.params.max)
            if (min > max) {
                resp.json(`Invalid range. Min rating (${req.params.min}) is greater than max rating (${req.params.max}).`);
            } else {
                Movie.find()
                    .where("ratings.average")
                    .gt(min)
                    .lt(max)
                    .then((data) => {
                        if (data.length == 0) {
                            resp.status(500).json(`No movies found with the average ratings of ${req.params.min} - ${req.params.max}`)
                        } else {
                            resp.json(data);
                        }
                    })
                    .catch((err) => {
                        resp.json({ message: "Unable to connect to movies vis avg ratings" });
                    });
            }
        })
    }
    /**returns movies whose title contians the provided search query. This search is case insensitive. 
     * 
     * @param {*} app 
     * @param {*} Movie 
     */
const handleMoviesByTitle = (app, Movie) => {
    app.get('/movies/title/:title', helper.ensureAuthenticated, (req, resp) => {

        Movie.find({ title: new RegExp(req.params.title, 'i') })
            .then((data) => {
                if (data.length == 0) {
                    resp.json({ message: `No movies titles found matching ${req.params.title}` })
                } else {
                    resp.json(data)
                }
            })
            .catch((err) => {
                resp.json({ messgae: "Unable to connect to movies" })
            })
    })
}

/** returns movies that have a genre matching search query. This search is case insensitive. 
 *  
 * @param {} app 
 * @param {*} Movie 
 */
const handleMoviesByGenre = (app, Movie) => {
    app.get('/movies/genre/:genre', helper.ensureAuthenticated, (req, resp) => {
        Movie.find({ 'details.genres.name': new RegExp(`${req.params.genre}`, 'i') })
            .then((data) => {
                if (data.length === 0) {
                    resp.status(500).json(`No movies found with genre ${req.params.genre}`)
                } else {
                    resp.status(200).json(data)
                }
            })
            .catch((err) => {
                resp.status(500).json({ message: "Unable to connect to movies bc genre stuff " })
            })
    })
}


module.exports = {
    handleAllMovies,
    handleMovieById,
    handleMoviesByYear,
    handleMoviesWithLimit,
    handleMoviesByTmdbId,
    handleMoviesByRatings,
    handleMoviesByTitle,
    handleMoviesByGenre,
    handleLoginPage
}