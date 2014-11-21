var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuizzSchema = new Schema({
	testName: String,
	questions: [{
		question: String,
		answer1: String,
		answer2: String,
		answer3: String,
		answer4: String,
		correctAnswer: String
	}]
});

module.exports = mongoose.model('Quizz', QuizzSchema);
