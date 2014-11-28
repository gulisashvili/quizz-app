var mongoose = require('mongoose');
var User = require('../models/user');



// GET registration page
exports.index = function(req, res) {
  res.render('registration');
};





exports.register = function(req, res) {
  var b = req.body;

  if(b.username && b.password) {
    var regData = {
      username: b.username,
      password: b.password
    };

    User.findOne({ username: regData.username }, function(err, data) {
      if(!data) {
        new User(regData)
          .save(function(err, data) {
            if(err) throw err;
            res.json({'status': 'success'});
        }); 
      } else {
          res.json({'status' : 'error'} );
      }
    });

    
    
  } else {
    res.json({'status': 'error'});
  }


};
