// redirect user to login page if they are not authenticated and try to access a protected page
function ensureAuthenticated(req, resp, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('info', 'Please log in to view resources');
    resp.render('../index', { message: req.flash('info') });
}

// if user is authenticated then redirect them to home page
function redirectLoggedIn(req, resp, next) {
    if (req.isAuthenticated()) {
        return resp.redirect('/');
    }
    return next()
}
module.exports = {
    ensureAuthenticated,
    redirectLoggedIn
};