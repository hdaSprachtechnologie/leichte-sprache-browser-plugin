//@see https://www.w3schools.com/nodejs/nodejs_mongodb.asp
var dict = require('./lexicon').dict;
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var dbname = "leichtesprache";
var table = "lexicon";

dict.forEach(element => {
    element.confidence = 5; //manually defined data
});

MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
  if (err) throw err;
  var dbo = db.db(dbname);
  dbo.collection(table).insertMany(dict, function(err, res) {
    if (err) throw err;
    console.log("Number of documents inserted: " + res.insertedCount);
    db.close();
  });
});

