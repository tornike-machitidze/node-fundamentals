const { Writable } = require('node:stream');
const { open, write, close } = require('node:fs');

class FileWriteStream extends Writable {
    constructor({ highWaterMark, fileName }) {
        super({ highWaterMark });

        this.fileName = fileName;
        this.fd = null;
        this.chunks = [];
        this.chunksSize = 0;
    }
    // _construc is running after constructor
    // if in _construct callback err was passed it means smth went wrong and next things will not execute
    // it callback was executed without err it means all is good
    _construct(cb) {
        open(this.fileName, 'w', (err, fd) => {
            if (err) {
                // if cb gets any arguments it means err
                cb(err);
            } else {
                this.fd = fd;
                // no arguments means all is good
                cb();
            }
        });
    }

    _write(chunk, encoding, callback) {
        this.chunks.push(chunk);
        this.chunksSize += chunk.length;

        if (this.chunksSize > this.writableHighWaterMark) {
            write(this.fd, Buffer.concat(this.chunks), (err) => {
                if (err) {
                    return callback(err);
                }
                this.chunks = [];
                this.chunksSize = 0;
                callback();
            });
        } else {
            callback();
        }
    }

    _final(callback) {
        write(this.fd, Buffer.concat(this.chunks), (err) => {
            if (err) {
                callback(err);
            } else {
                callback();
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

const writeStream = new FileWriteStream({ highWaterMark: 16384, fileName: 'custom.txt' });

writeStream.write(Buffer.from('Hello'));
writeStream.end(Buffer.from('Last bytes.'));
writeStream.on('finish', () => {
    console.log('End was called, so _final was called and calback was called without err');
});
