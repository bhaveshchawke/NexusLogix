/**
 * Checks if the user is authenticated.
 * If not, redirects to the login page.
 */
exports.isAuth = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/clientLogin');
    }
    next();
};

exports.isHost = (req, res, next) => {
    if (!req.session.isHost) {
        return res.redirect('/?error=unauthorized'); // Redirect to home with an error
    }
    next();
};