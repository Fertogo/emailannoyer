$(document).ready(function(){
    $("#addEmailBtn").click(function(){

        console.log("button click")
        var email = {
            'subject': $("#subject").val(),
            'text' : $("#text").val(),
            'html' : $("#html").val(),
            'usersConfirmed' : ['user1', 'user2'],
            'id' : Math.random().toString(36).substring(7)
        };


        console.log(email)
        $.ajax({
          method: "POST",
          url: "/email/new",
          dataType: 'JSON',
          data: email,
          success: function() {alert("Email Added")}
        })

        //TODO Clear FORM
    });



});
