// TODO change out console.log for debug statements

var express = require('express');
var mongodb = require('mongodb');
var handler = require('./requestHandlers');
var assert = require('assert');
var path = require('path');

var MongoClient = mongodb.MongoClient;

var url = 'mongodb://172.18.0.1:27017/dev';

var app = express();

app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'jade');

MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    //HURRAY!! We are connected. :)
    console.log('Connection established to', url);

    // do some work here with the database.

    //Close connection
    db.close();
  }
});

app.get('/', function(req, res) {
  res.render('index');
});

//TODO refactor so that this route exits early when non-valid url is used.
app.get('/new/*', function(req, res) {

  //req url
  if (handler.validate(req)) {
    console.log('request contains valid url: ' + req.params[0]);

    // make insert
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      handler.insertDocument(db, req, function(data) {
        console.log("DB insert looks like: " + JSON.stringify(data));
        res.json({
          reqUrl: data.reqUrl,
          shortUrl: req.get('host') + '/' + data.shortUrl
        });
        db.close();
      });
    });
  } else {
    console.log('req url not in required form.')
    res.status(400).send('Error: requested url must be in form: "https://example.com" \
                          or "http://example.com"');
  }
});

app.get('/*', function(req, res) {
  //retrieve a url and redirect
  res.send(req.params[0]);
});

app.listen(3000, function(){
  console.log('urlshortenify app listening on port 3000!');
});
