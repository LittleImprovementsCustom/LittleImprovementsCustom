// require modules
const express = require("express");
const compileScript = require("./server/compile");

// setup express
const app = express();
app.use(express.json()); // to support JSON-encoded bodies

// webpage the user sees, on a get request
app.get("/", function (req, res) {
  res.send("<h1>Hello World!</h1>");
})

// how to handle a post request, sent by the client-side js
app.post('/', function (req, res) {
  console.log(req.body)
  if (req.body.new=="true") {
    res.send('helo');
    console.log("dllink="+compileScript.compilePack(req.body));
  } else {
    res.send('sorry ur bad');
  }
  
})

// listen server with express
app.listen(process.env.PORT || 3000, 
	() => console.log("Server running"));