// Create streaming simulation
// do not read and write file at once but streaming way chunck by chunck and do not use Streams


const { open } = require('node:fs/promises');

(async () => {
    const defaultChunkSize = 65536;

    try {
        const readFileHandle = await open('./video.mp4', 'r');
        const writeFileHandle = await open('./copied.mp4', 'w');
        let readFileSize = (await readFileHandle.stat()).size;
        let currentReadingAndWritingPosition = 0;

        while (readFileSize > 0) {
            let chunkSize = readFileSize >= defaultChunkSize ? defaultChunkSize : readFileSize;
            readFileSize -= chunkSize;

            const bufferChunk = Buffer.alloc(chunkSize);

            await readFileHandle.read(bufferChunk, 0, chunkSize, currentReadingAndWritingPosition);
            await writeFileHandle.write(bufferChunk, 0, chunkSize, currentReadingAndWritingPosition);

            currentReadingAndWritingPosition += chunkSize - 1;
        }

        await readFileHandle.close();
        await writeFileHandle.close();

        process.stdout.write('file was copied successfully!');
    } catch (err) {
        console.error(err);
    }
})();
