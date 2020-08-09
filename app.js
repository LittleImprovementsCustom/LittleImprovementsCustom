const express = require("express")
const app = express();
app.use(express.json());       // to support JSON-encoded bodies

const fs = require('fs');

app.get("/", function (req, res) {
  res.send("<h1>Hello World!</h1>");
})

app.post('/', function (req, res) {
  //var factory = req.body.factory;
  //console.log("factory="+factory)
  console.log(req.body)
  if (req.body.new=="true") {
    res.send('helo');
    fs.mkdir("potato")
  } else {
    res.send('sorry ur bad');
  }
  
})

app.listen(process.env.PORT || 3000, 
	() => console.log("Server running"));