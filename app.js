var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var session = require('cookie-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var User = require('./models/user');
var Quizz = require('./models/quizz');

var routes = require('./routes/index');
var registration = require('./routes/registration');
var authMiddlware = require('./middlewares/auth');
var admin = require('./routes/admin');





var app = express();

app.set('env', process.env.NODE_ENV = process.env.NODE_ENV || 'development'); 

// connect to database based on enviroment
if(app.get('env') === 'development') {
  mongoose.connect("mongodb://localhost/quiz-app");
} else {
  mongoose.connect("mongodb://levanigls:milan@ds061200.mongolab.com:61200/quizz-db");
}


app.set('trust proxy', 1) // trust first proxy

app.use(session({
  keys: ['key1', 'key2']
}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Log In Page 
app.get('/', function (req, res) {
  if(req.session.user) {
    res.redirect('/tests');
  } else {
    res.render('index');
  }
});




// Tests routes
app.use('/tests', authMiddlware.ensureAuth, routes);

// Register Routes
app.route('/register')
  .get(registration.index)
  .post(function (req,res, next) {
    next();
  }, registration.register);

// Admin Routes
app.use('/admin', authMiddlware.ensureAuthAndAdmin, admin);

// Log in route
app.post('/login', function (req, res) {
  var b = req.body;
  User.findOne({username: b.username, password: b.password}, function(err, user) {
    if(user) {
      req.session.user = user;
      res.json({ redirect: '/tests'});
    } else if(!user) {
        res.json({ status: false });
    }
  });
});

// Log out route
app.get('/logout', function (req, res) {
  req.session = null;
  res.redirect('/');
});



// check score of test 
app.post('/checktest', function (req, res) {
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

    var newScoreData = {
      quizzName: testName,
      quizzScore: finalScore
    };

    User.update({ _id: req.session.user['_id'],'quizzHistory.quizzName':testName},
    { 
        $set: {
        	"quizzHistory.$.quizzName":testName,
        	"quizzHistory.$.quizzScore":finalScore
        }
    },
    function(err, upd) {
      if(!upd){
    		User.update({ _id: req.session.user['_id']},
    		{ "$addToSet": { quizzHistory:  newScoreData }},function(err,data){
    		});
      }
    });
    
    res.json( {
      finalScore: finalScore
    });
  });
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
          message: err.message,
          error: err
      });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
      message: err.message,
      error: {}
  });
});



app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  console.log("Server is Listening on: " + app.get('port'));
});
