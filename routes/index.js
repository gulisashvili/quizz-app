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



router.post('/checktest', function(req, res) {
	var score = 0;
	var correctAnswers = [];
	var result = req.body;
	var testName = result.testName;
	var checkedAnswers = result.checkedAnswers;

	Quizz.findOne({ testName: testName }, function(err, quizz) {
		var arr = quizz.questions;
		for(var i=0; i < arr.length; i++) {
			correctAnswers.push(arr[i].correctAnswer)
		}
	
		for(var i=0; i < checkedAnswers.length; i++ ) {
			if(checkedAnswers[i] === correctAnswers[i]) {
				score += 1;
			}
		}
		var finalScore = Math.round((100*score)/(checkedAnswers.length));
		
		res.json( {
			finalScore: finalScore
		});
	});
});





module.exports = router;
