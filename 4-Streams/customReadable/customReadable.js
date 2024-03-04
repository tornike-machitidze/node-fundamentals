const { Readable } = require('node:stream');
const { open, read, close } = require('node:fs');

class FileReadStream extends Readable {
    constructor({ highWaterMark, fileName }) {
        super({
            highWaterMark,
        });

        this.fileName = fileName;
        this.fd = null;
        this.pos = 0;
        this.bytesRead = 0;
    }

    _construct(callback) {
        open(this.fileName, 'r', (err, fd) => {
            if (err) {
                callback(err);
            } else {
                this.fd = fd;
                callback();
            }
        });
    }

    _read(size) {
        const buf = Buffer.alloc(size);
        read(this.fd, buf, 0, size, this.pos, (er, bytesRead, buf) => {
            if (er) {
                this.destroy(er);
            } else if (bytesRead > 0) {
                this.pos += bytesRead;

                this.bytesRead += bytesRead;

                if (bytesRead !== buf.length) {
                    const dst = Buffer.allocUnsafeSlow(bytesRead);
                    buf.copy(dst, 0, 0, bytesRead);
                    buf = dst;
                }

                this.push(buf);
            } else {
                this.push(null);
            }
        });
    }

    _destroy(error, callback) {
        if (this.fd) {
            close(this.fd, (err) => {
                callback(err | error);
            });
        } else {
            callback(error);
        }
    }
}

const readStream = new FileReadStream({
    highWaterMark: 2,
    fileName: './test.txt',
});
readStream.on('data', (chunk) => {
    console.log(chunk);
});

readStream.on('end', () => {
    console.log('reading ended');
});
