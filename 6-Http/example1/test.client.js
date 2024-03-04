const http = require('node:http');

const agent = new http.Agent({ keepAlive: true }); //tcp connection details
// what kind of tcp connection we want to estabilish

const request = http.request({
  agent,
  hostname: 'localhost',
  port: 6060,
  method: "POST",
  path: '/users',
  headers: {
    "Content-Type": 'application/json',
    // 'transfer-encoding': 'chunked' // if you do not specified in the request headers content-length and send data, it automaticly adds transfer-encoding header which equals chunked value
    //  at that moment at that request you have to specified the and of the request body by
    // request.end() to tell the request theat  it is the last chunk
  }
});

request.write(JSON.stringify({ message: 'message from client: request' }));
request.write(JSON.stringify({ message: '!' }));
request.write(JSON.stringify({ message: 'OK' }));
request.end(JSON.stringify({ message: 'end!' }));


const postData = JSON.stringify({ message: 'second request' });
const secondRequest = http.request({
  agent,
  host: '127.0.0.1',
  port: 6060,
  path: '/new-path',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData) // content-length is specified so only this size of data will be send, size in bytes
  }
});
secondRequest.write(postData);


request.on('response', (response) => {

});


