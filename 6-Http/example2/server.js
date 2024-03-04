const http = require('http');

const server = http.createServer((req, res) => {
  console.log('-----------METHOD----------');
  console.log(req.method);

  console.log('-----------PATH || URL----------');
  console.log(req.url);

  console.log('-----------HEADERS----------');
  console.log(req.headers);

  console.log('________BODY_______');
  // console.log(req.body); // bad idea because it can be huge data and we do not need to read it in memory
  // because we know that request is a readable stream we can read from it in a flowing mode.
  let data = '';
  req.on('data', (chunk) => {
    console.log(chunk.toString('hex'));
    data += chunk.toString('utf-8');
  });

  req.on('end', () => {
    // data = JSON.parse(data);
    console.log(data);
  });

  res.writeHead(200, { 'Content-Type': 'application/json' });

  res.end(JSON.stringify({ message: 'Hello there' }));
});

server.listen(8080, 'localhost', () => {
  console.log('server is running on port 8080');
});