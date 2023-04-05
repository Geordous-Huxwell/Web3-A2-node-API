const helper = require('./helpers.js');

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
const handleMoviesWithLimit = (app, Movie) => {
    app.get('/movies/limit/:num', helper.ensureAuthenticated, (req, resp) => {
        // set the initiial limit 
        let limit;
        if (200 < (parseInt(req.params.num))) {
            limit = 200;
        } else {
            limit = parseInt(req.params.num);
        }
        Movie.find()
            .limit(limit)
            .then((data) => {
                resp.status(200).json(data);
            })
            .catch((err) => {
                resp.status(500).json({ message: "Unable to connect to movies handle moviews with limits " })
            })
    })
}


// returns based on a tmbd_id matches the provided id 
const handleMoviesByTmdbId = (app, Movie) => {
        app.get('/movies/tmdb/:id', helper.ensureAuthenticated, (req, resp) => {
            Movie.find({ tmdb_id: req.params.id })
                .then((data) => {
                    if (data.length == 0) {
                        resp.status(500).json({ message: "No movie found matching TMDB ID " + req.params.id })
                    } else {
                        resp.status(200).json(data)
                    }
                })
                .catch((err) => {
                    resp.status(500).json({ message: "Unable to connect to movies bc tmbdid styff " })
                })
        })
    }
    // Returns all the movies wgo average ratinfg is between the two supplied values. if min is klarder then max return error message
const handleMoviesByRatings = (app, Movie) => {
        app.get('/movies/ratings/:min/:max', helper.ensureAuthenticated, async(req, resp) => {
            if (req.params.min > req.params.max) {
                console.log("min is bigger then max")
                resp.json({ message: "You put your Minimum value to be bigger then your maxium value" });
            } else {
                Movie.find()
                    .where("ratings.average")
                    .gt(req.params.min)
                    .lt(req.params.max)
                    .then((data) => {
                        resp.json(data);
                    })
                    .catch((err) => {
                        resp.json({ message: "Unable to connect to movies vis avg ratings" });
                    });
            }
        })
    }
    // returns movies whose title contians (somewhere) the provided text. This search should be case insensitive 
const handleMoviesByTitle = (app, Movie) => {
    app.get('/movies/title/:title', helper.ensureAuthenticated, (req, resp) => {

        Movie.find({ title: new RegExp(req.params.title, 'i') })
            .then((data) => {
                if (data.length == 0) {
                    resp.json({ message: "Invalid input" })
                } else {
                    resp.json(data)
                }
            })
            .catch((err) => {
                resp.json({ messgae: "Unable to connect to movies via handlemoviesbyTitle" })
            })
    })
}

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