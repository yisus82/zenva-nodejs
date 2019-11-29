const fs = require('fs');

exports.updateLogFile = message => {
  fs.readFile('./log.txt', (err, logContent) => {
    if (err) {
      throw err;
    }

    const lines = logContent.toString().split('\n');
    const firstLine = lines[0];
    const accessCounterIndex = firstLine.indexOf(':');
    const numberOfAccesses = parseInt(firstLine.slice(accessCounterIndex + 2));

    lines[0] = `Number of accesses: ${numberOfAccesses + 1}`;
    const newLogContent = `${lines.join('\n') + message}\n`;
    fs.writeFile('log.txt', newLogContent, err => {
      if (err) {
        throw err;
      }
    });
  });
};
