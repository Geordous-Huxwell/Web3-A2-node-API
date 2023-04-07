function ensureAuthenticated(req, resp, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('info', 'Please log in to view resources');
    resp.render('../index', { message: req.flash('info') });
}

function redirectLoggedIn(req, resp, next) {
    // if user is authenticated then redirect them to 
    if (req.isAuthenticated()) {
        return resp.redirect('/');
    }
    return next()
}
module.exports = {
    ensureAuthenticated,
    redirectLoggedIn
};