var session = require('cookie-session');


// ensure user is authenticated
exports.ensureAuth = function (req, res, next) {
  if(req.session.user) {
    next();
  } else {
    res.redirect('/');
  }
};

// ensure user is authenticated and is admin
exports.ensureAuthAndAdmin = function (req, res, next) {
    if(req.session.user) {
      if(req.session.user.userType == "admin") {
        next();
      } else {
          res.redirect('/');
      }
    }
     else {
        res.redirect('/');        
    }
};
