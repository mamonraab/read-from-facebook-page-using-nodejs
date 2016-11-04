var web = require('express');
var bodyParser = require('body-parser'); //geting the medileware that parse the post
var validator = require('validator');
const formidable = require('express-formidable');
//using underscore labrry
var _ = require('underscore');
var app = web();
var port = process.env.PORT || 3000;
var ECT = require('ect');
var ectRenderer = ECT({ watch: true, root: __dirname + '/views', ext: '.ect' });
var url = "https://graph.facebook.com/v2.8/";
var query = "202409816773047?fields=feed.limit(10)%7Bfull_picture%2Cmessage%2Ccreated_time%7D";
var token = require('./config.js');
var path = require('path');
var mamonfetcher = require('./fb-func');
app.use(web.static(path.join(__dirname, 'r32')));
app.set('view engine', 'ect');
app.engine('ect', ectRenderer.render);
process.setMaxListeners(0);
app.use(formidable()); //working with post request
/*
req.fields; // contains non-file fields
 req.files; // contains files
*/
app.set('view engine', 'ect');
app.engine('ect', ectRenderer.render);


app.get('/fb', function(input, output) {
    output.header("Content-Type", "application/json; charset=utf-8");
    mamonfetcher.fetchfb(url + query + token).then(function(data) {
        var jsonObject = JSON.parse(data);
        output.json(jsonObject.feed);
    }, function(eror) {
        output.json({ "error": "page problem" });

    });

});

app.get('/fb2', function(input, output) {
    //output.header("Content-Type", "application/json; charset=utf-8");

    var url = "https://graph.facebook.com/v2.8/202409816773047?fields=feed.limit(10)%7Bfull_picture%2Cmessage%2Ccreated_time%7D&access_token=742912495847708|R7_vOrPKm34iLPAn7-eKq5sWBNc";
    request(url, function(error, response, body) {
        var jsonObject = JSON.parse(body);

        output.render('index', jsonObject.feed);
    });


});



app.get('/', function(input, output) {
    //output.header("Content-Type", "application/json; charset=utf-8");
    var all = {
        feed: null,
        slide: null,
        cover: null

    };
    output.header("Content-Type", "application/json; charset=utf-8");

    mamonfetcher.fetchfb(url + query + token).then(function(data) {
        var jsonObject = JSON.parse(data);
        all.feed = jsonObject.feed;
        mamonfetcher.fetchfb(url + "369158126764881?fields=photos.limit(10){images}" + token).then(function(data) {
            var jsonObject = JSON.parse(data);
            all.slide = jsonObject.photos;


            mamonfetcher.fetchfb(url + "202409816773047?fields=picture.height(1080)" + token).then(function(data) {
                var jsonObject = JSON.parse(data);
                all.cover = jsonObject.picture.data;
                output.json(all);

            }, function(eror) {
                return output.json({ "error": "page problem" });

            });


        }, function(eror) {
            return output.json({ "error": "page problem" });

        });
    }, function(eror) {
        return output.json({ "error": "page problem" });

    });






});

app.get('/onepage', function(req, res) {




    res.sendFile('r32/OnePage2/index.html', { root: __dirname });

});



app.listen(port, function() {
    console.log('app runing in port ' + port);
});