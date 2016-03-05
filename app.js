var express =   require("express");
var multer  =   require('multer');
var app         =   express();
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    filename =  file.fieldname + Date.now();
    console.log("Uploaded " + filename);
    callback(null, filename);
  }
});

var upload = multer({ storage : storage}).single('content');

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
            res.end("Uploaded");
        }
    });
});

app.listen(8080, function(){
    console.log("Working on port 8080");
});
