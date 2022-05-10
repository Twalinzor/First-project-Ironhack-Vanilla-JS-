function isNotLoggedIn(req, res, next) {
	if (req.session.currentUser) {
		res.redirect('/user/profile');
	} else {
		next();
	}
}

module.exports = isNotLoggedIn;
