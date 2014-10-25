$(function() {


register();




});

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
