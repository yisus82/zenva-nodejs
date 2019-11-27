const http = require('http');
const request = require('request');

let requestBody;

const createHtmlStringFromJSON = retrievedData => {
  let htmlString =
    '<html lang="en">\n\t<header>\n\t\t<title>Data aggregator</title>\n\t\t<meta charset="UTF-8">\n\t</header>\n\t<body>\n\t\t<table>\n';
  htmlString += '\t\t\t<theader>\n\t\t\t\t<tr>\n';
  Object.entries(retrievedData[0]).forEach(([key, value]) => {
    if (typeof value !== 'object') {
      htmlString += `\t\t\t\t\t<th>${key}</th>\n`;
    }
  });
  htmlString += '\t\t\t\t</tr>\n\t\t\t</theader>\n\n\t\t\t<tbody>\n';

  retrievedData.forEach(object => {
    htmlString += '\t\t\t\t<tr>\n';
    Object.values(object).forEach(value => {
      if (typeof value !== 'object') {
        htmlString += `\t\t\t\t\t<td>${value}</td>\n`;
      }
    });
    htmlString += '\t\t\t\t</tr>\n';
  });
  htmlString += '\t\t\t</tbody>\n\t\t</table>\n\t</body>\n</html>';
  return htmlString;
};

request('https://www.bnefoodtrucks.com.au/api/1/trucks', (err, res, body) => {
  requestBody = body;
});

http
  .createServer((req, res) => {
    if (requestBody) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(createHtmlStringFromJSON(JSON.parse(requestBody)));
    } else {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Nothing retrieved yet');
    }
  })
  .listen(8080);
