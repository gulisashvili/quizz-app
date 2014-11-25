var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../models/user');
var Quizz = require('../models/quizz');




router.get('/', function(req, res) {
	Quizz.find({}, function(err, quizzs) {
		if(err) { throw err; }
		res.render('tests/home', { quizzs: quizzs });
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
