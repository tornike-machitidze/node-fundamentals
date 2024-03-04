const net = require('node:net');

/**
 * TCP Server
 * @param { Object } socket - A Duplex Stream
 */
const tcpServer = net.createServer((socket) => {
    socket.on('data', (readData) => {
        // Read Buffers
        console.log(readData)
    })
})

tcpServer.listen(4080, '127.0.0.1' ,() => {
    console.log('Listening is started on ' + '127.0.0.1:', + 4080 )
})