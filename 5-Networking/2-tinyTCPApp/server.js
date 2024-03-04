const net = require('net'); // lowest level in node
const server = net.createServer((socket) => {
    socket.on('data', (chunk)=>{
        console.log(chunk)
    })
})

server.listen(3099, '127.0.0.1', () => {
    console.log('opened server on', server.address())
})