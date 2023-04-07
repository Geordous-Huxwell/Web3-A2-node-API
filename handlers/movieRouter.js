const helper = require('./helpers.js');
/**This function gets all the movies 
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
 *  ensuring that the user is still authentic and logged in 
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
/** This function gets all the movies from api based on a given year range, given th min and max amount of years,
 *  it also ensures when attrevieing this data that the user is still logged in. In this function we also confirm 
 *  that the input is valid. 
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

            for (let searchYear = minYear; searchYear <= maxYear; searchYear++) {
                const movies = await Movie.find({ release_date: new RegExp(`^${searchYear}`) })
                moviesInRange.push(...movies)

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
    // get all movies within a limit 
    /**
     * this function gets movies up to a given limit. it will also respond if you dont put in a valid range 
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


// returns based on a tmbd_id matches the provided id 
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
    // Returns all the movies wgo average ratinfg is between the two supplied values. if min is klarder then max return error message
const handleMoviesByRatings = (app, Movie) => {
        app.get('/movies/ratings/:min/:max',helper.ensureAuthenticated,  async(req, resp) => {

            const min= parseInt(req.params.min)
            const max = parseInt(req.params.max)
            if (min>max) {
                resp.json(`Invalid range. Min rating (${req.params.min}) is greater than max rating (${req.params.max}).` );
            } else {
                Movie.find()
                    .where("ratings.average")
                    .gt(min)
                    .lt(max)
                    .then((data) => {
                        if(data.length == 0 ){
                            resp.status(500).json(`No movies found with the average ratings of ${req.params.min} - ${req.params.max}`)
                        }else{
                            resp.json(data);
                        }  
                    })
                    .catch((err) => {
                        resp.json({ message: "Unable to connect to movies vis avg ratings" });
                    });
            }
        })
    }
    /**returns movies whose title contians (somewhere) the provided text. This search should be case insensitive 
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
                resp.json({ messgae: "Unable to connect to movies via handlemoviesbyTitle" })
            })
    })
}
/** returns movies whos genre is from the given output. it will verify that the movie genre is a valid genre 
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
/**
 * this will redirect to the login page
 * @param {} app 
 * @param {*} User 
 */
const handleLoginPage = (app, User) => {
    app.get('/login', (req, res) => {
        res.render('../index.ejs')
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