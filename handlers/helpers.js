// uses passport authentication to check if authentication is 
// needed at some point in middleware pipeline.
function ensureAuthenticated(req, resp, next) {
    // console.log('req', req)
    console.log('req.isAuthenticated()', req.isAuthenticated())
    if (req.isAuthenticated()) {
        console.log('user is authenticated')
        return next();
    }
    req.flash('info', 'Please log in to view resources');
    resp.render('../index', { message: req.flash('info') });
}
module.exports = { ensureAuthenticated };