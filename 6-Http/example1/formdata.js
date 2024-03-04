const http = require('node:http');

const agent = http.Agent({ keepAlive: true });
const request = http.request({
  agent,
  host: '127.0.0.1',
  port: 6060,
  headers: {
    'Content-Type': 'multipart/form-data'
  }
}, (response) => {
  console.log(response.body);
});

request.write('name=email');
request.end();