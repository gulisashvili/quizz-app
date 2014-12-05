var express = require('express');
var adminRouter = express.Router();
var mongoose = require('mongoose');
var Quizz = require('../models/quizz');
var User = require('../models/user');


adminRouter.use(function (req, res, next) {
	
	Quizz.find({}, function(err, quizzs) {
		if(err) { throw err; }
		res.locals.quizzs = quizzs;
		next();
	});

});

adminRouter.use(function (req, res, next) {
	
	User.find({ userType: 'user' }, function(err, users) {
		if(err) { throw err; }
		res.locals.users = users;
		next();
	});

});


adminRouter.get('/', function(req, res) {
	res.render('admin/index');
});



// show edit quizz page
adminRouter.get('/tests/:id/edit', function(req, res) {
	Quizz.findOne({ _id: req.params.id }, function(err, quizz) {
		if(err) { throw err; }
		res.render('admin/edit', { quizz: quizz });	
	});
});

// update quizz
adminRouter.put('/tests/:id/update', function(req, res) {
	var result = req.body;

	Quizz.findOneAndUpdate({ _id: req.params.id}, result, function(err, updatedQuizz) {
		if(err) { throw err; }
	 	res.json({redirect: '/admin'});
	});


});





// delete quizz
adminRouter.delete('/tests/:id', function(req, res) {
	Quizz.remove({ _id: req.params.id }, function(err) {
		if(err) {
			res.json({ success: false });
		} else {
			res.json({ success: true });
		}
	});	

});


adminRouter.get('/create/test', function(req, res) {
	res.render('admin/create');
});

adminRouter.post('/create/test', function(req, res) {
	var result = req.body;

	var testName = result.testName,
		questions = result.questions;

	new Quizz({
		testName: testName,
		questions: questions
	})
	.save(function (err) {
  	if (err) return handleError(err);
	});

	res.json({redirect: '/admin'});

});



// User Delete Route
adminRouter.get('/users/:id/delete', function(req, res) {
	
	User.remove({ _id: req.params.id}, function(err) {
		if(err) { throw err; }
		res.redirect('/admin');
	});

});







module.exports = adminRouter;
