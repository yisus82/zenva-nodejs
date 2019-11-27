const http = require('http');
const request = require('request');
const fs = require('fs');

let requestBody;
let htmlContent;

const createHtmlStringFromJSON = retrievedData => {
  const bodyBeginIndex = htmlContent.indexOf('<body>');
  const bodyEndIndex = htmlContent.indexOf('</body>');
  const stringUntilBody = htmlContent.slice(0, bodyBeginIndex + 6);
  const stringFromBody = htmlContent.slice(bodyEndIndex);

  let htmlString = '\n\t\t<table>\n';
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
  htmlString += '\t\t\t</tbody>\n\t\t</table>\n\t';
  return stringUntilBody + htmlString + stringFromBody;
};

http
  .createServer((req, res) => {
    if (req.url === '/') {
      request(
        'https://www.bnefoodtrucks.com.au/api/1/trucks',
        (err, _res, body) => {
          if (err) {
            throw err;
          }
          requestBody = body;
          fs.readFile('./index.html', (err, html) => {
            if (err) {
              throw err;
            }
            htmlContent = html;
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(createHtmlStringFromJSON(JSON.parse(requestBody)));
          });
        }
      );
    } else {
      fs.readFile(`./${req.url}`, (err, data) => {
        if (err) {
          res.statusCode = 404;
          res.end('404: File Not Found');
        } else {
          res.end(data);
        }
      });
    }
  })
  .listen(8080);
