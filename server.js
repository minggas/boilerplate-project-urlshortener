'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var dns = require('dns');

var cors = require('cors');

var app = express();
var bodyParser = require('body-parser');
var router = express.Router();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.urlencoded({extended: 'false'}));
app.use(bodyParser.json());

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

var Url = require('./Models.js').UrlModel;
var findUrl = require('./Models.js').findUrl;
var saveUrl = require('./Models.js').saveUrl;

// Save shortened URL in DB
router.post('/shorturl/new', function(req, res, next){
  var url = req.body.url;
   dns.lookup(url.replace("https://", "").replace("http://", ""),(err, address, family) => {
     if(address){
       Url.findOne({long_end: req.body.url}, function(err, data) {
         if(err) { return (next(err)); }
         if(!data){
           saveUrl(url, function(err, data){
              if(err) { return (next(err)); }
              res.json({original_url:data.long_end, short_url: data.id});
           });
         } else {
           res.json({original_url:data.long_end, short_url: data.id});
         }
      });
     }else{
    res.json({"error":"invalid URL"});
    }  
   });  
});


router.get('/shorturl/:id', function(req, res, next){  
  Url.findById(req.params.id, function(err, pers) {
       if(err) { return (next(err)); }
       return res.redirect(pers.long_end); 
     });
});


app.use('/api', router);


app.listen(port, function () {
  console.log('Node.js listening ...');
});
