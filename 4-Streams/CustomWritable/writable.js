const { createReadStream, createWriteStream, stat } = require('fs');

let copiedSize = 0;

stat('../customReadable/video.mp4', (err, { size }) => {
    const readStream = createReadStream('../customReadable/video.mp4');
    const writeStream = createWriteStream('./copy.mp4');

    readStream.on('data', (chunk) => {
        copiedSize += chunk.length
        const percnet = ((100 * copiedSize) / size).toFixed(2)
        process.stdout.write(`Copied part is ${percnet} % \n`);
        writeStream.write(chunk);
    });

    readStream.pause();

    process.stdin.on('data', (chunk) => {
        if (chunk.toString().trim() === 'add') {
            readStream.read();
        } else if (chunk.toString().trim() === 'stop') {
            process.stdout.write('process was stoped!!!');
            process.exit();
        }
    });
});
