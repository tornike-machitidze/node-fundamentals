const net = require('net');

/**
 * TCP Client
 *
 */

const tcpClient = net.createConnection({ host: '127.0.0.1', port: 4080 }, () => {
    console.log('Connection listener was hitted');
});

// Socket a Duplex Stream

const data = Buffer.from('Hello!');
tcpClient.write(data, (err) => {
    if (err) console.log('Something went wrong!');
});
