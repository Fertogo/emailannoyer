$(document).ready(function(){

    //Get all emails and render info on a collapsible panel based on template
    $.get( "email/getAll", function( data ) {
        console.log(data)

        if (data.length == 0) $("#loading").text("No emails yet")

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
            var usersNotConfirmed = "";


            $.get("users/getAllNames", function(allNames) {
                $.each(email.usersConfirmedNames, function(index, user){
                    usersConfirmed +=  user + "</br>";
                    allNames.splice(allNames.indexOf(user),1) //Remove all confirmed users
                });
                $.each(allNames, function(index, user){
                    usersNotConfirmed += user + "</br>";
                });
                if (email.usersConfirmedNames.length === 0) usersConfirmed = "none";
                if (allNames.length === 0) usersNotConfirmed = "none!"; //Everyone confirmed!
                newPanel.find(".email-text").html(email.html);
                newPanel.find(".users-confirmed-text").html(usersConfirmed);
                newPanel.find(".users-not-confirmed-text").html(usersNotConfirmed);

                newPanel.find(".panel-date").text(new Date(email.lastDay).toDateString())

                $("#loading").hide();
                $("#accordion").append(newPanel.fadeIn());

            })
        })
    });

})
