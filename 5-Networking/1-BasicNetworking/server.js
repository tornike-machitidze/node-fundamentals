const http = require('http');

const port = 4080;
const hostnameLoopBack = '127.0.0.1'; // loopback interface // only my machine can access

const server = http.createServer((req, res) => {
    const data = { msg: 'My message in the world' };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Connection', 'close');
    res.statusCode = 200;
    res.end(JSON.stringify(data));
});

server.listen(port, hostnameLoopBack, () => {
    console.log(`Server is started and running on http://${hostnameLoopBack}:${port} port`);
});
