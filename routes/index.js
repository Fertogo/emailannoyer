var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', { title: 'Email Annoyer' });
});

// /* GET add email page. */
// router.get('/email', function(req, res, next) {
//   res.render('email', {  });
// });


/* GET home page. */
router.get('/confirm/:name', function(req, res, next) {
    var name = req.params.name;

    if (name === "error") {

        res.render('error', {})
    }
    res.location("confirm");
    console.log(name)
    res.render('confirm', { name: name });


    // console.log("Scheduling...")
    // var schedule = require('node-schedule')

    // for (var i = 1; i<3; i++){
    //     var date = new Date()
    //     date.setSeconds(date.getSeconds() + (i*10));

    //     var j = schedule.scheduleJob(date, function(){
    //         console.log("HAIIII")
    //     })
    // }

});

module.exports = router;
