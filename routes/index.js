var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../models/user');
var Quizz = require('../models/quizz');

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

router.get('/tests/:id', function(req, res) {
	Quizz.findOne({ _id: req.params.id}, function(err, quizz) {
		if(err) { throw err };
		res.render('tests/index', {
			quizz: quizz
		});
	})



});

module.exports = router;
