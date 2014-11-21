var express = require('express');
var adminRouter = express.Router();
var mongoose = require('mongoose');
var Quizz = require('../models/quizz');

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
