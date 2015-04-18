var express = require('express');
var router = express.Router();

/* GET add email page. */
router.get('/', function(req, res, next) {
    console.log("ADD EMAIL FORM ")
  res.render('email', {  });
});




/*
* Handle new Email request
* Add email to db
* Schedule jobs several jobs until deadline
*/
router.post('/new', function(req, res, next) {
    console.log("Hi therea")
   // console.log(req.body)

    //Add email to db
    var newEmail = req.body;
    newEmail['usersConfirmed'] = []

    console.log(newEmail)
    var db = req.db;
    var emails = db.collection('emails')
    emails.insert(newEmail, function(err,doc){
        if (err) console.log("There was an error with the db")
        else console.log("Email added to db")


        var schedule = require('node-schedule')
        var date = new Date();
        sendEmailtoUnconfirmed(newEmail, db);

        date.setSeconds(date.getSeconds() + 30)
        var j = schedule.scheduleJob(date,function(){
            sendEmailtoUnconfirmed(newEmail, db);
        })


    })

    //Schedule Jobs






    // console.log("Scheduling...")
    // var schedule = require('node-schedule')

    // for (var i = 1; i<3; i++){
    //     var date = new Date()
    //     date.setSeconds(date.getSeconds() + (i*10));

    //     var j = schedule.scheduleJob(date, function(){
    //         console.log("HAIIII")
    //     })
    // }

    //res.send("Got it!")


});

/*
* Sends email to all users that haven't confirmed
* @param email Email object to send
*
*/

function sendEmailtoUnconfirmed(email, db){
    console.log("Sending email")
    //Get email from the db
    db.collection('emails').findOne({id: email.id}, function(err, result){
        if (!err && result){
            console.log(result)
            var usersConfirmed = result.usersConfirmed;
            console.log("Users Confirmed: ")
            console.log(usersConfirmed)
            //Get all users
            db.collection('userlist').find().toArray(function (err, users) {
                if (!err && users){
                    for (i in users){
                        console.log(users[i].name)
                        if (usersConfirmed.indexOf(users[i].id) < 0){ //user is not confirmed
                            sendEmail(email, users[i])
                        }
                        else console.log(user[i].name + " already confirmed!")
                    }

                }
            });

        }

    })


}

// Sends the email to the reciever
function sendEmail(email, reciever){
    console.log("Sending Email to " + reciever.name)
    //TODO
}

module.exports = router;
