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

app.get('/', function(req, res) {
  console.log('host name is ' + req.get('host'))
  res.render('index', { host: req.get('host')} );
});

//TODO refactor so that this route exits early when non-valid url is used.
app.get('/new/*', function(req, res) {

  //req url
  var inputUrl = req.params[0];
  if (handler.validate(inputUrl)) {
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

app.get('/:shortUrl', function(req, res) {
  //retrieve a url and redirect
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    handler.getFullUrl(db, req, function(data) {
      console.log('A shortUrl request to the database returned: ' +
        JSON.stringify(data));
      if (data[0]) {
        res.redirect(data[0].reqUrl);
      } else {
        res.send('url not found')
      }
    });
  });
});

app.listen(3000, function(){
  console.log('urlshortenify app listening on port 3000!');
});
