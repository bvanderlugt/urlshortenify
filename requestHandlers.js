// var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var shortid = require('shortid');

function validate(req) {
  var re = /(http:\/\/|https:\/\/)(..)+/g;
  return re.test(req.params[0]);
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

exports.validate = validate;
exports.insertDocument = insertDocument;
exports.getDocuments = getDocuments;