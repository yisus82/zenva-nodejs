const http = require('http');
const request = require('request');
const fs = require('fs');
const csv = require('csv');

let requestBody;
let htmlContent;

const createHtmlStringFromCSV = retrievedData => {
  const bodyBeginIndex = htmlContent.indexOf('<body>');
  const bodyEndIndex = htmlContent.indexOf('</body>');
  const stringUntilBody = htmlContent.slice(0, bodyBeginIndex + 6);
  const stringFromBody = htmlContent.slice(bodyEndIndex);

  let htmlString = '\n\t\t<table>\n';
  htmlString += '\t\t\t<theader>\n\t\t\t\t<tr>\n';
  retrievedData[0].forEach(attribute => {
    htmlString += `\t\t\t\t\t<th>${attribute}</th>\n`;
  });
  htmlString += '\t\t\t\t</tr>\n\t\t\t</theader>\n\n\t\t\t<tbody>\n';

  const data = retrievedData.slice(1);
  data.forEach(row => {
    htmlString += '\t\t\t\t<tr>\n';
    row.forEach(cell => {
      htmlString += `\t\t\t\t\t<td>${cell}</td>\n`;
    });
    htmlString += '\t\t\t\t</tr>\n';
  });
  htmlString += '\t\t\t</tbody>\n\t\t</table>\n\t';
  return stringUntilBody + htmlString + stringFromBody;
};

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
    if (req.url === '/json') {
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
    } else if (req.url === '/csv') {
      request(
        'https://www.data.brisbane.qld.gov.au/data/dataset/1e11bcdd-fab1-4ec5-b671-396fd1e6dd70/resource/3c972b8e-9340-4b6d-8c7b-2ed988aa3343/download/Brisbane-public-art-collection-Jul-2016-Rev-1.2.csv',
        (err, _res, body) => {
          if (err) {
            throw err;
          }
          csv.parse(body, (err, data) => {
            requestBody = data;
            fs.readFile('./index.html', (err, html) => {
              if (err) {
                throw err;
              }
              htmlContent = html;
              res.writeHead(200, { 'Content-Type': 'text/html' });
              res.end(createHtmlStringFromCSV(requestBody));
            });
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
