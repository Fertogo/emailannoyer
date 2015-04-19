$(document).ready(function(){

    //Get all emails and render info on a collapsible panel based on template
    $.get( "email/getAll", function( data ) {
        console.log(data)
        $.each(data, function(index, email){
            //Generate panel
            console.log(email.subject);
            var newPanel = $("#template").clone();
            // $("#template").remove();
            newPanel.css('display','inherit');
            newPanel.find(".accordion-toggle")
                        .attr("href",  "#" + email.id)
                        .text(email.subject);
            newPanel.find(".panel-collapse")
                         .attr("id", email.id)
                         .addClass("collapse")
                         .removeClass("in");

            var usersConfirmed = ""
            $.each(email.usersConfirmedNames, function(index, user){
                usersConfirmed +=  user + "</br>"
            });
            if (email.usersConfirmedNames.length === 0) usersConfirmed = "none"

            newPanel.find(".email-text").text(email.text);
            newPanel.find(".users-confirmed").html(usersConfirmed);

            newPanel.find(".panel-date").text(new Date(email.lastDay).toDateString())

            $("#loading").hide();
            $("#accordion").append(newPanel.fadeIn());
        })
    });

})
