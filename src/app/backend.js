// npm install request
const request = require('request');
const fs = require('fs');

var opts = {
  uri: 'https://api.sejda.com/v2/html-pdf',
  headers: {
    'Authorization' : 'Token: api_public_a4e46ba5772d4aa98e7e7736a8fb6790',
  },
  json: {
    'url': 'https://airtable.com',
    'viewportWidth': 1200
  }
};

request.post(opts)
  .on('error', function(err){
    return console.error(err);
  })
  .on('response', function(response) {
    console.log(response.statusCode)
    if (response.statusCode === 200) {
      response.pipe(fs.createWriteStream('/tmp/out.pdf'))
        .on('finish', function () {
          console.log('PDF saved to disk');
        });
    } else {
      return console.error('Got code: ' + response.statusCode);
    }
  });
