$(function() {

login();
register();
generateQuestions();
sendTest();

});



function questTemplateGenerator(number) {
  var template = [
    '<div class="form-group question-wrapper"><label> question ' + number + ' </label>',
    '<input class="form-control question-name" placeholder="enter question">',
    '<input class="form-control answer-1" placeholder="enter answer 1">',
    '<input class="form-control answer-2" placeholder="enter answer 2">',
    '<input class="form-control answer-3" placeholder="enter answer 3">',
    '<input class="form-control answer-4" placeholder="enter answer 4">',
    '<input class="form-control correct-answer" placeholder="correct answer">'
  ].join('');
  return template;
}




function register() {
  var regBtn = $('#reg-btn');


  regBtn.on('click', function(e) {
    e.preventDefault();
    var regUsername = $('#reg-username').val();
    var regPassword = $('#reg-password').val();

    if( regUsername != '' && regPassword != '') {
      var sendData = {
        username: regUsername,
        password: regPassword
      };

      $.post('/register', sendData, function(data) {
        if(data.status == "success") {
          $('.main-wrapper').find('.alert').remove();
          $('.main-wrapper').prepend('<div class="alert alert-success"> <strong> Succesfully Registered</strong><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span> </div>');
        } else if (data.status == "error") {
          $('.main-wrapper').find('.alert').remove();
          $('.main-wrapper').prepend('<div class="alert alert-danger"> <strong> User is Already Registered or Validation has Failed </strong><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span></div>');
        }
      });
    } else {
        $('.main-wrapper').find('.alert').remove();
        $('.main-wrapper').prepend('<div class="alert alert-danger"> <strong> Both fields are required </strong> <button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span></div>');
    }
  });
};


function login() {
  var loginBtn = $('#login-btn');

  loginBtn.on('click', function(e) {
    e.preventDefault();
    var username = $('#username').val(),
        password = $('#password').val();

    var sendData = {
      username: username,
      password: password
    };

    $.post('/', sendData, function(data) {
      console.log(data);
    });
  });
}



function generateQuestions() {
  var genBtn = $('#gen-test-btn');
  var genQuestions = $('.generated-questions');
  var counter = 0;

  genBtn.on('click', function(e) {
    e.preventDefault();
    var quizzName = $('#test-name').val();

    $(questTemplateGenerator(++counter)).hide().appendTo(genQuestions).fadeIn(500);

  });

};



function sendTest() {
  var saveBtn = $('#save-test-btn');


  saveBtn.on('click', function() {
    var counter=1;
    var question = {};
    var questionArr = [];
    var testName = $('#test-name').val();
    var questionWrapper = $('.question-wrapper');
    questionWrapper.each(function(index, element) {
      var question = $(element).children('input.question-name').val(),
        answer1 = $(element).children('input.answer-1').val(),
        answer2 = $(element).children('input.answer-2').val(),
        answer3 = $(element).children('input.answer-3').val(),
        answer4 = $(element).children('input.answer-4').val(),
        correctAnswer = $(element).children('input.correct-answer').val();

        question = {
          question: question,
          answer1: answer1,
          answer2: answer2,
          answer3: answer3,
          answer4: answer4,
          correctAnswer: correctAnswer
        }  

      
        questionArr.push(question); 
        question = {};
    });
      var sendData = {
        testName: testName,
        questions : questionArr
      }


      $.ajax({
        type: "POST",
        contentType: 'application/json',
        data:  JSON.stringify(sendData),
        url: "/admin/create/test",
        success: function(result){
          console.log(sendData);  
          if (typeof result.redirect == 'string') {
            window.location = result.redirect;
          }
        }
      });

  });


};
