var express = require('express');
var router = express.Router();

var basicAuth = require('basic-auth-connect');

var auth = basicAuth('admin', process.env.ADMIN_PASS);

/*
 * GET userlist.
 */
router.get('/userlist', auth, function(req, res) {
    console.log("getting userlist")
    var db = req.db;
    db.collection('userlist').find().toArray(function (err, items) {
        console.log(items)
        res.json(items);
    });
});

router.get('/getAllNames', function(req, res){
    console.log("getting all names");
    var names = [];
    var db = req.db;
    db.collection('userlist').find().toArray(function(err, users){
        for (var i in users){
            names.push(users[i].fullname);
        }
        res.json(names);

    })

})

/*
 * Confirm an Email
 * Given a user id and an emailid, checks that both are valid and then adds the user id to confirmedUsers field of email
 */
router.get('/confirmEmail/:userid/:emailid', function(req, res) {
    console.log("updating")
    var db = req.db;
    var userid = req.params.userid;
    var emailid = req.params.emailid;
    var emailConfirmed = false;

    //Confirm that user exists
    db.collection('userlist').findOne({id:userid}, function(err, result) {
        if (!err && result){
            console.log('Found Memeber');
            var user = result

            db.collection('emails').findOne({id:emailid}, function(err, result){
                if (!err && result){ //Email found
                    var email = result;
                    var users = email.usersConfirmed;
                    var usersConfirmedNames = email.usersConfirmedNames;

                    if (users.indexOf(user.id) < 0){
                        users.push(user.id);
                        usersConfirmedNames.push(user.fullname);
                    }


                    db.collection('emails').update({id:email.id}, {$set:{usersConfirmed:users, usersConfirmedNames: usersConfirmedNames}}, function(err, result) {
                        if (!err && result) {
                            console.log('updated!');
                            emailConfirmed = true;
                            //console.log(emailConfirmed)
                            // If it worked, set the header so the address bar
                            res.location("/confirm");
                            // And forward to success page
                            res.redirect("/confirm/"+user.name);
                         }
                         else res.redirect("/confirm/error");
                    });
                }
                else {
                    console.log("Email not found :(")
                    res.redirect("/confirm/error");//Email not found
                }
            });
        }
        else {
            res.redirect("/confirm/error"); //User not found
        }

    });

});



module.exports = router;
