const http = require('http');
const fs = require('fs/promises');

const server = http.createServer();

server.on('request', async (request, response) => {
  if (request.url === '/' && request.method === 'GET') {

    response.setHeader('Content-Type', 'text/html');

    const fileHandle = await fs.open('./public/index.html', 'r');
    const readStream = fileHandle.createReadStream();

    readStream.pipe(response);
  } else if (request.url === '/style.css' && request.method === 'GET') {
    response.setHeader('Content-Type', 'text/css');

    const fH = await fs.open('./public/style.css', 'r');
    const rS = fH.createReadStream();
    rS.pipe(response);
  } else if (request.url === '/horse.jpg' && request.method === 'GET') {
    response.setHeader('Content-Type', 'image/jpeg');

    const fH = await fs.open('./public/horse.jpg', 'r');
    const stream = fH.createReadStream();

    stream.pipe(response);
  } else if (request.url === '/client.js' && request.method === 'GET') {
    response.setHeader('Content-Type', 'text/javascript');

    const handle = await fs.open('./public/client.js', 'r');
    const stream = handle.createReadStream();

    stream.pipe(response);
  } else if (request.url === '/upload?file=horse.jpg') {
    console.log(request.url);
    const fileHandle = await fs.open('./storage/image.jpg', 'w');
    const writeStream = fileHandle.createWriteStream();

    request.pipe(writeStream);

    response.setHeader('Content-Type', 'text/plane');
    response.statusCode = 200;
    response.end('file was uploaded');
  }
});

server.listen(9000, () => {
  console.log('Server is runnin on http://localhost:9000');
});