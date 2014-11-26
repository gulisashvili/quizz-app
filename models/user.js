var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  userType: { type: String, default: 'user'},
  quizzHistory: [{
  	quizzName: String,
  	quizzScore: Number
  }]
});

module.exports = mongoose.model('users', UserSchema);
