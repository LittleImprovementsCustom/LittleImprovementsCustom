const qs = require('querystring')
const express = require("express")
var app = express()
//const fs = require('fs')

app.use(express.json());       // to support JSON-encoded bodies


app.post('/', function (req, res) {
  var factory = req.body.factory;
  console.log("factory="+factory)
  res.send('POST request to homepage');
})

app.listen(3000)