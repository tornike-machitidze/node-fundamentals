const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');

const server = http.createServer();

server.on('request', async (req, res) => {
  // console.log(req);
  // await fs.writeFile(path.join(__dirname, 'request.json'), Buffer.from(req));

  console.log('________METHOD_______');
  console.log(req.method);

  console.log('________URL_______');
  console.log(req.url);

  console.log('________HEADER_______');
  console.log(req.headers);

  const user = req.headers.user;

  console.log('________BODY_______');
  // console.log(req.body); // bad idea because it can be huge data and we do not need to read it in memory
  // because we know that request is a readable stream we can read from it in a flowing mode.
  let data = '';
  req.on('data', (chunk) => {
    data += chunk.toString('utf-8');
  });

  req.on('end', () => {
    // data = JSON.parse(data);
    console.log(data);
    console.log(user);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: user + 'you successfylly create a new post: ' + data.title }));
  });


});

server.listen(6060, () => {
  console.log('Server started');
});