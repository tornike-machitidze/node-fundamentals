// TCP (Transmision Control) || IPC (Inter-process Control) protocole based servers and clients.
const net = require('net');

// VARIABLES
const PORT = 4080;
const HOST = '127.0.0.1';

// returns instance of the Server. return new Server(); createServer gets one argument cb function in which it puts a new Socket when new connection is made.
const server = net.createServer();

// sockets list.
const sockets = [];

// this is another way to listen any connection on host:port. once there will be a connection cb will be executed with an argument socket.
server.on('connection', (socket) => {
    // log msg when new connection is made. So connection from client happens once. every next time client just writes something in the socket.
    console.log('A new connection to the server!');

    // asign a socket, id.
    const socketId = sockets.length + 1;

    // let every client knows that new user is joined;
    sockets.forEach((client) => {
        client.socket.write(`User ${socketId} joined!`);
    });

    // let clients know their ids id-1
    socket.write(`id-${socketId}`);

    // add new socket in sockets list.
    sockets.push({ id: socketId.toString(), socket });

    //Request. reading client request here.
    socket.on('data', (request) => {
        // decode the request/data buffer in to string
        const requestString = request.toString('utf-8');
        // grab the id from the request.
        const id = requestString.substring(0, requestString.indexOf('-'));
        // grab the aqtual data from the request.
        const msg = requestString.substring(requestString.indexOf('-message-') + 9);

        // send response for every client/socket.
        sockets.forEach((client) => {
            // write response here.
            client.socket.write(`> User ${id}: ${msg} `);
        });
    });

    // when client leavs the chat let everyone knows
    socket.on('end', () => {
        sockets.forEach((client) => {
            client.socket.write(`User ${socketId} left!`)
        })
    })
});

// we should said the server on which hots:port it should listen and if there will be any connection execute functions registered on 'connection' event.
server.listen(PORT, HOST, () => {
    console.log('start app on host:port', server.address());
});
