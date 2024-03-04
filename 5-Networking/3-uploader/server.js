const net = require('net');
const fs = require('node:fs/promises');

//Variables
const port = 2080;
const host = '::1';

const server = net.createServer(() => {});

server.on('connection', (socket) => {
    console.log('New connection!');
    let fileHandle, fileWriteStream;

    // 0. Writing was started in the socket from client side
    socket.on('data', async (data) => {
        // Extract file name from the first request
        // Create file and the file write stream
        if (!fileHandle) {
            // 1. pause socket reading before file will be opened.
            socket.pause();
            // 2. extract the file name
            const dataToString = data.toString('utf-8');
            const lastIndex = dataToString.indexOf('---');
            const fileName = dataToString.substring(10, lastIndex);

            // 3. Create filehandle + writeStream
            fileHandle = await fs.open(`./storage/${fileName}`, 'w');
            fileWriteStream = fileHandle.createWriteStream();

            // 4. continue reading from socket
            socket.resume();

            // 5. Add drain event to the write stream ONCE
            fileWriteStream.on('drain', () => {
                // continue reading
                socket.resume();
            });
        } else {
            // start writing from the socket in the file

            // writing + check for needDrain
            if (!fileWriteStream.write(data)) {
                // pause reading from request
                socket.pause();
            }
        }
    });

    // on connection end
    socket.on('end', () => {
        // close fileHandle
        fileHandle.close();
        fileHandle = null;
        fileWriteStream = null;

        console.log('Connection has ended!');
    });
});

server.listen(port, host, () => {
    console.log(`Server started no `, server.address());
});
