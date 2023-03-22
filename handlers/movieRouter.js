const handleAllMovies = (app, Movie) => {
    app.get('/movies', (req, res) => {
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
    app.get('/movies/:id', (req, res) => {
        Movie.find({ id: req.params.id })
            .then((movie) => {
                res.status(200).json(movie)
            })
            .catch((err) => {
                res.status(500).json(`No movie found matching ID ${req.params.id}`)
            })
    })
}

const handleMoviesByYear = (app, Movie) => {
    app.get('/movies/year/:min/:max', async(req, res) => {
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



// const handleMoviesByYear = (app, Movie) => {
//     app.get('/movies/year/:min/:max', (req, res) => {
//         const moviesInRange = []
//         const minYear = parseInt(req.params.min)
//         const maxYear = parseInt(req.params.max)
//             // const searchYear = minYear

//         const moviePromise = new Promise((resolve, reject) => {
//             for (let searchYear = minYear; searchYear <= maxYear; searchYear++) {
//                 Movie.find({ release_date: new RegExp(`^${searchYear}`) })
//                     .then((movies) => {
//                         moviesInRange.push(movies)
//                         res.json(movies)
//                     })
//             }
//             resolve(moviesInRange)
//         })
//         moviePromise.then((moviesInRange) => {
//                 console.log(moviesInRange)
//                 res.status(200).json(moviesInRange)
//             })
//             // console.log(moviesInRange)
//             // Movie.find({ release_date: { $gte: minYear, $lte: maxYear } })
//             //     .then((movies) => {
//             //         console.log(movies)
//             //         res.status(200).json(movies)
//             //     })
//             //     .catch((err) => {
//             //         res.status(500).json(`No movies found between ${req.params.min} and ${req.params.max}`)
//             //     })
//     })
// }

module.exports = {
    handleAllMovies,
    handleMovieById,
    handleMoviesByYear
}