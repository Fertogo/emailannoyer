$(document).ready(function(){
    $("#addEmailBtn").click(function(){

        console.log("button click")
        var email = {
            'subject': $("#subject").val(),
            'text' : $("#text").val(),
            'html' : $("#html").val(),
            'id' : Math.random().toString(36).substring(7),
            'date' : new Date($("#date").val())
            //usersConfirmed added on server
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
