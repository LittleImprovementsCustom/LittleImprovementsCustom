var qs = require('querystring')


const http = require('http');
const port = process.env.PORT || 3000

const server = http.createServer((req, res) => {
  if (req.method==="POST") {
    console.log("received post request")
    var body = '';

    req.on('data', function (data) {
        body += data;

        // Too much POST data, kill the connection!
        // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
        if (body.length > 1e6)
            req.connection.destroy();
    });

    req.on('end', function () {
        var post = qs.parse(body);
        // use post['blah'], etc.
    });
    
    console.log(post)

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