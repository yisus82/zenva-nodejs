const http = require('http');
const request = require('request');

let requestBody;

request('https://www.bnefoodtrucks.com.au/api/1/trucks', function(
  err,
  res,
  body
) {
  requestBody = body;
});

http
  .createServer(function(req, res) {
    if (requestBody) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(requestBody);
    } else {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Nothing retrieved yet');
    }
  })
  .listen(8080);
