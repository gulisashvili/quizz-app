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
var auth = require('./middlewares/auth');
var admin = require('./routes/admin');


mongoose.connect("mongodb://localhost/quiz-app");



var app = express();


app.set('trust proxy', 1) // trust first proxy

app.use(session({
  keys: ['key1', 'key2']
}))


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function(req, res) {
  res.render('index');
});


app.use('/tests',checkAuth, routes);

app.route('/register')
  .get(registration.index)
  .post(function(req,res, next) {
      next();
  },registration.register);

app.use('/admin', checkAuthAndAdmin, admin);

function checkAuthAndAdmin(req, res, next) {
    if(req.session.user) {
      if(req.session.user['username'] == "levanigls" && req.session.user['password'] == "milan") {
        next();
      } else {
          res.redirect('/');
      }
    }
     else {
        res.redirect('/');        
    }
}


function checkAuth(req, res, next) {
  if(req.session.user) {
    next();
  } else {
    res.redirect('/');
  }
};

app.post('/login', function(req, res) {
  var b = req.body;
  User.findOne({username: b.username, password: b.password}, function(err, user) {
    if(user) {
      console.log(user);
      req.session.user = user;
      console.log(req.session);
      res.json({ redirect: '/tests'});
    } else if(!user) {
        res.json({ status: false });
    }
  });
});


app.get('/logout', function(req, res) {
  req.session = null;
  console.log(req.session);
  res.redirect('/');
});


app.post('/checktest', function(req, res) {
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







// catch 404 and forward to error handler
app.use(function(req, res, next) {
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
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
      message: err.message,
      error: {}
  });
});


module.exports = app;
