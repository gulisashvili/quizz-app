
exports.ensureAuth = function (request, response, next) {
	var isAuthanticated = true;
	if(isAuthanticated) {
		next();
	} else {
		response.redirect('/');
	}
}
