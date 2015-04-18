var express = require('express');
var router = express.Router();

/*
 * GET userlist.
 */
router.get('/userlist', function(req, res) {
    console.log("getting userlist")
    var db = req.db;
    db.collection('userlist').find().toArray(function (err, items) {
        console.log(items)
        res.json(items);
    });
});

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

                    if (users.indexOf(user.id) < 0) users.push(user.id);

                    db.collection('emails').update({id:email.id}, {$set:{usersConfirmed:users}}, function(err, result) {
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
            })
        }
        else {
            res.redirect("/confirm/error"); //User not found
        }

    });

});



module.exports = router;
