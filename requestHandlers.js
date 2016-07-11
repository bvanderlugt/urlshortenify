// var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var shortid = require('shortid');

function validate(input) {
  var re = /(http:\/\/|https:\/\/)(..)+/g;
  return re.test(input);
}

function insertDocument(db, req, callback) {
   var payload = {
     "reqUrl": req.params[0],
     "shortUrl": shortid.generate()
   }

  db.collection('urls').insertOne(payload,
    function(err, data) {
    assert.equal(err, null);
    callback(payload);
  });
}

function getDocuments(db, callback) {
  var cursor = db.collection('urls').find();
  cursor.toArray(function(err, doc) {
    if (err) throw err;
    console.log(doc);
    callback(doc);
    });
}

function getFullUrl(db, req, callback) {
  console.log("looking for" + JSON.stringify(req.params.shortUrl) + "in the db");
  var cursor = db.collection('urls').find( {shortUrl: req.params.shortUrl} )
  cursor.toArray(function(err, doc) {
    if (err) throw err;
    callback(doc);
  })
}

exports.validate = validate;
exports.insertDocument = insertDocument;
exports.getDocuments = getDocuments;
exports.getFullUrl = getFullUrl;
