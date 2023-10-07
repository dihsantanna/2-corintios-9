const fs = require('fs');

const file = fs.readFileSync('./expense-title-suggestions.json', {
  encoding: 'utf8',
});

const data = JSON.parse(file);

const newData = [];

data.forEach((item) => {
  if (!newData.includes(item)) {
    newData.push(item);
  }
});

fs.writeFileSync('./expense-title-suggestions.json', JSON.stringify(newData));
