var express = require('express');
var adminRouter = express.Router();
var mongoose = require('mongoose');
var Quizz = require('../models/quizz');






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
		console.log("++Updated++");
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



adminRouter.get('/', function(req, res) {
	Quizz.find({}, function(err, quizzs) {
		if(err) { throw err; }
		res.render('admin/index', { quizzs: quizzs });
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
		console.log("SAVED");
	});

	res.json({redirect: '/admin'});

});








module.exports = adminRouter;
