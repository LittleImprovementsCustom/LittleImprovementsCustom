// require modules
const express = require("express")
const Dropbox = require('dropbox').Dropbox;
require('isomorphic-fetch');
require('dotenv').config();

// setup express
const app = express();
app.use(express.json()); // to support JSON-encoded bodies

// setup dropbpx
const dbx = new Dropbox ({ fetch: fetch, accessToken: process.env.DBXACCESSTOKEN });

dbx.filesListFolder({path: ''})
    .then(function(response) {
      console.log(response.entries);
    })
    .catch(function(error) {
      console.error(error);
    });
/*
dbx.filesCreateFolderV2({path: "/potatocheese"})
.then(function(response) {
  console.log(response);
})
.catch(function(error) {
  console.error(error);
});*/

// webpage the user sees, on a get request
app.get("/", function (req, res) {
  res.send("<h1>Hello World!</h1>");
})

// how to handle a post request, sent by the client-side js
app.post('/', function (req, res) {
  //var factory = req.body.factory;
  //console.log("factory="+factory)
  console.log(req.body)
  if (req.body.new=="true") {
    res.send('helo');
    // create id
    const id = shortid.generate()
    console.log(id)
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

// listen server with express
app.listen(process.env.PORT || 3000, 
	() => console.log("Server running"));