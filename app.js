var mongoose = require('mongoose');
var connect = require('connect');
var express = require("express");
var multer = require('multer');
var app = express();
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
    console.log("Request Received");
    upload(req, res, function(err) {
        if(err) {
            console.log("ERROR: " + err);
            return res.end("Error uploading file.");
        } else{
            console.log("Successfully Uploaded");
            res.end("Uploaded");
        }
    });
});
// Starts server
app.listen(8080, function(){
    console.log("Working on port 8080");
});

