const { read, write, open, close, stat } = require('fs');
const { Buffer } = require('buffer');

open('./video.mp4', 'r', (err, fd) => {
    if (err) {
        console.log('Error while opening the video.mp4 file: ', err);
        close(fd, (err) => console.error(err));
        return;
    }

    stat('./video.mp4', (err, { size }) => {
        if (err) {
            console.log('Error while getting stat: ', err);
            return;
        }

        let position = 0

        while (size > 0) {
            const chunkSize = size >= 65536 ? 65536 : size;
            size -= chunkSize;

            const readChunk = Buffer.alloc(chunkSize);

            read(fd, readChunk, 0, chunkSize, position, (err, bytesRead, chunk) => {
                if (err) {
                    console.log('Error while reading the file: ', err);
                    return;
                }

                open('./test.mp4', 'w', (error, fd) => {
                    if (error) {
                        console.log('Error while opening the video.mp4 file: ', error);
                        close(fd, (err) => console.error(err));
                        return;
                    }

                    write(fd, chunk, 0, chunk.byteLength, position, (err, written, buff) => {
                        if (err) {
                            console.log('Error while writing the file: ', err);
                            return;
                        }
                        console.log('Written ', written);
                        console.log('Written Buffer Chunk: ', buff)
                    } );
                });

            });

            position +=  (chunkSize - 1)
        }
    });
});