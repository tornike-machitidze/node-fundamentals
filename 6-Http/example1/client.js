const http = require('node:http');

const agent = http.Agent({ keepAlive: true });

const data = JSON.stringify({ title: 'The title HTTP Protocole', content: 'Content ' });
const request = http.request({
  agent,
  host: 'localhost',
  port: 8080,
  method: 'POST',
  path: '/create-post',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
    'user': 'Joe'
  },
});

// what will happen when response will return
request.on('response', (response) => {

  console.log('_______STATUS______');
  console.log(response.statusCode);

  console.log('_______HEADERS______');
  console.log(response.headers);

  let data = '';
  response.on('data', (chunk) => {
    data += chunk.toString('utf-8');
  });

  response.on('end', () => {
    console.log(JSON.parse(data));
  });
});

// write the data in the body
request.write(data);
request.end();

