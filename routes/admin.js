var express = require('express');
var adminRouter = express.Router();
var str2json = require('string-to-json');

adminRouter.get('/', function(req, res) {
	res.render('admin/index');
});

adminRouter.get('/create/test', function(req, res) {
	res.render('admin/create');
});

adminRouter.post('/create/test', function(req, res) {
	console.log(req.body.data);
// console.log(JSON.parse(req.body.data));




	// var testName = req.body.testName;
	// var questions = req.body.questions;


	res.json({redirect: '/admin'});
});








module.exports = adminRouter;
