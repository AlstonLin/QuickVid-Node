var app = require('express')();
var multipart = require('multipart');
var sys = require('sys');

app.get('/', function (req, res) {
    res.render(
      '<form action="/upload" method="post" enctype="multipart/form-data">'+
      '<input type="file" name="upload-file">'+
      '<input type="submit" value="Upload">'+
      '</form>'
    );
  }
);

app.post('/upload', function (req, res) {
    req.setBodyEncoding('binary');

    var stream = new multipart.Stream(req);
    stream.addListener('part', function(part) {
      part.addListener('body', function(chunk) {
        var progress = (stream.bytesReceived / stream.bytesTotal * 100).toFixed(2);
        var mb = (stream.bytesTotal / 1024 / 1024).toFixed(1);
        sys.print("Uploading " + mb + "mb ("+progress+"%)\015");
        // chunk could be appended to a file if the uploaded file needs to be saved
      });
    });
    stream.addListener('complete', function() {
      res.sendHeader(200, {'Content-Type': 'text/plain'});
      res.sendBody('Thanks for playing!');
      res.finish();
      sys.puts("\n=> Done");
    });
});

app.listen(8080, function(){
  console.log("Listening on port 8080!")
});
