const http = require('http');
const port = process.env.PORT || 3000

const server = http.createServer((req, res) => {
  if (req.method==="POST") {
    console.log("received post request")
    res.end()
  }
  else {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end('<h1>Hello World</h1>');
  }
});

server.listen(port,() => {
  console.log(`Server running at port `+port);
});