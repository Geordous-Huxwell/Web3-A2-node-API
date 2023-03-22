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
// get all movies within a limit 
const handleMoviesWithLimit=(app,Movie)=>{
    app.get("/movies/limit/:num", (req, resp) => {
        // set the initiial limit 
        let limit;
        if (200<(parseInt(req.params.num))){
            limit=200;
        }else{
            limit=parseInt(req.params.num);
        }
        Movie.find()
             .limit(limit)
            .then((data)=>{
                resp.status(200).json(data);
         })
        .catch((err)=>{
            resp.status(500).json({message:"Unable to connect to movies handle moviews with limits "})
        });
    })
}
// returns based on a tmbd_id matches the provided id 
const handleMoviesByTmbdId =(app, Movie)=>{
    app.get('/movies/tmbd/:id',(req,resp)=>{
        Movie.find({tmdb_id : req.params.id})
        .then((data)=>{
            resp.status(200).json(data)
        })
        .catch((err)=>{
            resp.status(500).json({message:"Unable to connect to movies bc tmbdid styff "})
        })
    })
}
// Returns all the movies wgo average ratinfg is between the two supplied values. if min is klarder then max return error message
const handleMoviesByRatings = (app, Movie) => {
    app.get('/movies/ratings/:min/:max', async(req, resp) => {
        console.log("lalalla");
        Movie.find()
        .where("ratings.average")
        .gt(req.params.min)
        .lt(req.params.max)
        .then((data) => {
            resp.json(data);
          })
          .catch((err) => {
            resp.json({ message: "Unable to connect to books" });
          });
        // const moviesInRange = []
        // const minRating = parseInt(req.params.min)
        // console.log(minRating);
        // const maxRating = parseInt(req.params.max)

        // if (minRating > maxRating) {
        //     res.status(500).json(`Invalid range. Min rating (${req.params.min}) is greater than max rating (${req.params.max}).`)
        // }
        
        // for (let searchRating = minRating; searchRating <= maxRating; searchRating++) {
        //     const movies = await Movie.find({ 'ratings.average' : new RegExp(`^${searchRating}`) })
        //     moviesInRange.push(...movies)

        //     if (searchRating === maxRating) {
        //         if (moviesInRange.length === 0) {
        //             res.status(500).json(`No movies found between ${req.params.min} and ${req.params.max}`)
        //         } else {
        //             res.status(200).json(moviesInRange)
        //         }
        //     }
        // }
    })
}

module.exports = {
    handleAllMovies,
    handleMovieById,
    handleMoviesByYear,
    handleMoviesWithLimit,
    handleMoviesByTmbdId, 
    handleMoviesByRatings
}