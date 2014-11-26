var express = require('express');
var router = express.Router();
var session = require('cookie-session');
var mongoose = require('mongoose');
var User = require('../models/user');
var Quizz = require('../models/quizz');


router.use(function (req, res, next) {
	User.findOne({ username: req.session.user['username']}, function(err, user) {
		if(err) { throw err; }
		res.locals.user = user;
		next();
	});
});

router.get('/', function(req, res) {
	console.log(res.locals.user);
	Quizz.find({}, function(err, quizzs) {
		if(err) { throw err; }
		res.render('tests/home', { 
			quizzs: quizzs,
			user: res.locals.user
		});
	});

});







router.get('/:id', function(req, res) {
	Quizz.findOne({ _id: req.params.id}, function(err, quizz) {
		if(err) { throw err };
		res.render('tests/index', {
			quizz: quizz
		});
	})



});





module.exports = router;
