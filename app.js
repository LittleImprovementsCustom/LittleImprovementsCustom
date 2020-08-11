const express = require("express")
const app = express();
app.use(express.json());       // to support JSON-encoded bodies

require('isomorphic-fetch'); // or another library of choice.
var Dropbox = require('dropbox').Dropbox;
var dropboxaccesstoken = process.env.dropboxAcessToken
console.log(dropboxaccesstoken)
var dbx = new Dropbox({ accessToken: 'rOmqM2TYNjAAAAAAAAAAAVUgJCvtLXwOgKVzc0pmmLhEAa624zbiLW_zgyA0hGG1' });
dbx.filesListFolder({path: ''})
    .then(function(response) {
      console.log(response.entries);
    })
    .catch(function(error) {
      console.error(error);
    });

dbx.filesCreateFolderV2({path: "/potatocheese"})
.then(function(response) {
  console.log(response);
})
.catch(function(error) {
  console.error(error);
});

app.get("/", function (req, res) {
  res.send("<h1>Hello World!</h1>");
})

app.post('/', function (req, res) {
  //var factory = req.body.factory;
  //console.log("factory="+factory)
  console.log(req.body)
  if (req.body.new=="true") {
    res.send('helo');
    /*fs.mkdir("./potato", function(err) {
      if (err) {
        console.log(err)
      } else {
        console.log("New directory successfully created. congrats")
      }
    })*/
  } else {
    res.send('sorry ur bad');
  }
  
})

app.listen(process.env.PORT || 3000, 
	() => console.log("Server running"));