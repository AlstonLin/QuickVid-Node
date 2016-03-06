var mongoose = require('mongoose');
var connect = require('connect');
var express = require("express");
var multer = require('multer');
var app = express();
var ObjectId = require('mongodb').ObjectID;
bodyParser = require('body-parser');
app.use(express.static(__dirname + '/uploads'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
// DB setup
var connection = mongoose.connect('mongodb://localhost:27017/db');
var Item = require('./item.js');
// Storage
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    filename =  file.fieldname + Date.now();
    console.log("Uploaded " + filename);
    callback(null, filename);
    // Creates entry
    var newItem = new Item({
      url : filename,
      likes : 0,
      passes : 0
    })
    newItem.save(function (err) {
      if (err){
        console.log("ERROR - " + err);
        return err;
      } else{
        console.log("Saved to db");
      }
    });
  }
});
var upload = multer({ storage : storage}).single('content');
// Routes
app.get('/',function(req,res){
  res.sendFile(__dirname + "/index.html");
});

app.post('/upload', function(req, res){
  console.log("Upload Request");
  upload(req, res, function(err) {
    if (err) {
      console.log("ERROR: " + err);
      return res.end("Error uploading file.");
    } else{
      console.log("Successfully Uploaded");
      res.end("Uploaded");
    }
  });
});

app.post('/download', function(req, res){
  var aboveId = req.body.aboveId;
  var belowId = req.body.belowId;
  var amount = req.body.amount;
  console.log("Download Request with aboveId=" + aboveId + ", belowId=" + belowId + ", amount= " + amount);
  var query;
  if (aboveId != null && aboveId != "" && belowId != null && belowId != ""){ 
    query = Item.find({ $or: [{"_id": { $lt: ObjectId(belowId) } }, {"_id": { $gt: ObjectId(aboveId) }}]}).sort('-_id').limit(amount);
  } else query = Item.find({}).sort('-_id').limit(amount);
  query.exec(function(err, items){
    if (err){
      console.log("ERROR: " + err);
    } else {
      res.json(items);
    }
  });
});
// Starts server
app.listen(8080, function(){
  console.log("Working on port 8080");
});
