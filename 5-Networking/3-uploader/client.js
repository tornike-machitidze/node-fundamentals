const net = require('net');
const fs = require('node:fs/promises');
const path = require('path');

//Variables
const port = 2080;
const host = '::1';

// Helpers
const clearLine = (dir) => {
    // returns new Promise. resolved inside the cb.
    return new Promise((resolve, reject) => {
        // we still use Callback API but with Promise maner
        process.stdout.clearLine(dir, () => {
            // just resolves inside the cb.
            resolve();
        });
    });
};

const moveCursor = (dx, dy) => {
    // returns new Promise. resolved inside the cb.
    return new Promise((resolve, reject) => {
        // we still use Callback API of moveCursor but with Promise maner
        process.stdout.moveCursor(dx, dy, () => {
            // just resolves inside the cb.
            resolve();
        });
    });
};

console.log()

const socket = net.createConnection({ host, port }, async () => {
    const filePath = process.argv[2];
    // /Desktop/file.mp4 ==> file.mp4
    const fileName = path.basename(filePath);

    // Open file + create stream for reading from the file
    const fileHandle = await fs.open(filePath, 'r');
    const fileReadStream = fileHandle.createReadStream();
    const fileSize = (await fileHandle.stat()).size;

    let uploadPercentage = 0;
    let bytesUploaded = 0;

    // write first data in the socket
    socket.write(`fileName: ${fileName}---`);

    // Reading
    fileReadStream.on('data', async (chunk) => {
        // writting + check if needDrain
        if (!socket.write(chunk)) {
            // Stop reading
            fileReadStream.pause();
        }

        bytesUploaded += chunk.length;
        let currentPercentage = Math.floor((bytesUploaded / fileSize) * 100);

        if (currentPercentage !== uploadPercentage) {
            uploadPercentage = currentPercentage;
            await moveCursor(0, -1);
            await clearLine(0);
            console.log(`Uploading...${uploadPercentage}%`);
        }
    });

    // On drain
    socket.on('drain', () => {
        // Continue reading
        fileReadStream.resume();
    });

    // Error handling for fileReadStream
    fileReadStream.on('error', (err) => {
        console.error('Error reading from file:', err);
    });

    // Error handling for socket
    socket.on('error', (err) => {
        console.error('Error writing to socket:', err);
    });

    // Finish reading
    fileReadStream.on('end', () => {
        console.log('File was successfuly uploaded!');

        // close the connection
        socket.end();
    });
});
