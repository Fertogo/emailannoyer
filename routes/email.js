var express = require('express');
var router = express.Router();
var basicAuth = require('basic-auth-connect');

var auth = basicAuth('admin', 'pass')
/* GET add email page. */
router.get('/', function(req, res, next) {
    console.log("ADD EMAIL FORM ")
  res.render('email', {  });
});

/*
* Get all the emails, hide some properties and send response
*
*/
router.get('/getAll', function(req,res){
    console.log("Getting all emails");
    var db = req.db;
    var emails = [];
    db.collection('emails').find().toArray(function (err, items) {
        //items = list of email objects
        for (i in items){
            //items[i]['id'] = "secret",
            items[i]['usersConfirmed'] = ['secret'];
        }
        res.json(items);
    });
});



/*
* Handle new Email request
* Add email to db
* Schedule jobs several jobs until deadline
*/
router.post('/new', auth, function(req, res, next) {
    console.log("Hi therea");

   // console.log(req.body)

    //Add email to db
    var newEmail = req.body;
    newEmail['usersConfirmed'] = [];
    newEmail['usersConfirmedNames'] = [];
    newEmail['lastDay'] = new Date(newEmail.date);

    console.log(newEmail);

    var db = req.db;
    var emails = db.collection('emails');
    emails.insert(newEmail, function(err,doc){
        if (err) {
            console.log("There was an error with the db");
            res.send("DB Error")
        }
        else {
            res.send("success")
            console.log("Email added to db");
        }

       scheduleEmail(newEmail, db);

    }).bind(res);

});

/*
* Sends an email and schedules the next one
*/
function scheduleEmail(email, db){
    sendEmailtoUnconfirmed(email, db);

    console.log("Scheduling email");

    //Schedule next email
    var schedule = require('node-schedule');

    var today = new Date(); //Today's date
    var nextDay = new Date(); //date for next reminder
    var lastDay = email.lastDay;

    var daysLeft = Math.round((lastDay - today)/(1000*60*60*24));

    console.log("Days Left: " + daysLeft);

    if (daysLeft < 0 ) return ;//Email is done
    //How often to send emails depending on daysLeft
    // else if (daysLeft > 30) nextDay.setDays(today.getDays() + 7);
    // else if (daysLeft > 14) nextDay.setDays(today.getDays() + 3);
    // else if (daysLeft > 7) nextDay.setDays(today.getDays() + 1);
    // else if (daysLeft > 5) nextDay.setDays(today.getDays() + 0.5);
    // else nextDay.setHours(today.getHours() + 1);

    nextDay.setSeconds(today.getSeconds() + 15); //send every 30 seconds

    //Schedule an email for the next day
    var j = schedule.scheduleJob(nextDay,function(){
        scheduleEmail(email,db);
    });
    console.log("Next email scheduled for:" + nextDay.toDateString());


}

/*
* Sends email to all users that haven't confirmed
* @param email Email object to send
*
*/

function sendEmailtoUnconfirmed(email, db){
    console.log("Sending email");
    //Get email from the db
    db.collection('emails').findOne({id: email.id}, function(err, result){
        if (!err && result){
            //console.log(result);
            var usersConfirmed = result.usersConfirmed;
            console.log("Users Confirmed: ");
            console.log(usersConfirmed);
            //Get all users
            db.collection('userlist').find().toArray(function (err, users) {
                if (!err && users){
                    for (var i in users){
                        //console.log(users[i].name);
                        if (usersConfirmed.indexOf(users[i].id) < 0){ //user is not confirmed
                            sendEmail(email, users[i]);
                        }
                        else console.log(users[i].name + " already confirmed!");
                    }

                }
            });

        }

    });


}

// Sends the email to the reciever
function sendEmail(email, reciever){
    console.log("Sending Email to " + reciever.name);
    var confirmURL = 'http://localhost:3000/users/confirmEmail/'+reciever.id+'/'+email.id;

    var nodemailer = require('nodemailer');

    // create reusable transporter object using SMTP transport
    var transporter = nodemailer.createTransport({
        service: 'Mailgun',
        auth: {
            user: process.env.MAILGUN_USERNAME,
            pass: process.env.MAILGUN_PASSWORD
        }
    });

    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: 'Email Annoyer ✔ <email@annoyer.com>', // sender address
        to: reciever.email, // list of receivers
        subject: email.subject, // Subject line
        text: email.text.replace(/##NAME##/g, reciever.name).replace(/##CONFIRM##/g, confirmURL), // plaintext body
        html: email.html.replace(/##NAME##/g, reciever.name).replace(/##CONFIRM##/g, confirmURL) // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }else{
            console.log('Message sent: ' + info.response);
        }
    });


}

module.exports = router;
