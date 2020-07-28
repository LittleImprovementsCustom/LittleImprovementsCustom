const http = require('http');
const port = process.env.PORT || 3000

const server = http.createServer(function (req, res) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end('<h1>Hello World</h1>');
  if (req.method === "POST") {
    console.log("received post request")
  }
}).listen(3000);

/*server.listen(port,() => {
  console.log(`Server running at port `+port);
});*/