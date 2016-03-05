var express = require('express');
var app = express();
var fs = require('fs');

//To test on browser root url is a simple html form to upload files
app.get('/', function(req, res){
  res.send(
      '<form action="/upload" method="post" enctype="multipart/form-data">'+
      '<input type="file" name="source">'+
      '<input type="submit" value="Upload">'+
      '</form>'
  );
});

//The upload picture request handler
app.post('/upload', function(req, res){
  //This debugging meassage displays all the info that comes with the file
  console.log("Received file:\n" + JSON.stringify(req.files));
  //Set the directory names
  var dir = __dirname+"/uploads/";
  //We use Node's FileSystem to rename the file, which actually moves it from the /tmp/ folder it goes to on Linux
  fs.rename(
    req.files.source.path,
    photoDir + "test.mp4",
    function(err){
      if(err != null){
        res.send({error:"Error Occurred"});
      }
    }
  );
});

app.listen(8080);
