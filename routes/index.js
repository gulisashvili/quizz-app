var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.post('/', function(req, res) {
	var b = req.body;
	User.findOne({username: b.username, password: b.password}, function(err, user) {
		if(user) {
			console.log(user);
			// req.session.user = user;
			// res.redirect(301, '/tests');
		} else if(!user) {
				res.redirect('/');
		}
	});
});

module.exports = router;
