const fs = require('fs');

const readStream = fs.createReadStream('./video.mp4');

// ReadStream.prototype._read = function(n) {
//     n = this.pos !== undefined ?
//       MathMin(this.end - this.pos + 1, n) :
//       MathMin(this.end - this.bytesRead + 1, n);

//     if (n <= 0) {
//       this.push(null);
//       return;
//     }

//     const buf = Buffer.allocUnsafeSlow(n);

//     this[kIsPerformingIO] = true;
//     this[kFs]
//       .read(this.fd, buf, 0, n, this.pos, (er, bytesRead, buf) => {
//         this[kIsPerformingIO] = false;

//         // Tell ._destroy() that it's safe to close the fd now.
//         if (this.destroyed) {
//           this.emit(kIoDone, er);
//           return;
//         }

//         if (er) {
//           errorOrDestroy(this, er);
//         } else if (bytesRead > 0) {
//           if (this.pos !== undefined) {
//             this.pos += bytesRead;
//           }

//           this.bytesRead += bytesRead;

//           if (bytesRead !== buf.length) {
//             // Slow path. Shrink to fit.
//             // Copy instead of slice so that we don't retain
//             // large backing buffer for small reads.
//             const dst = Buffer.allocUnsafeSlow(bytesRead);
//             buf.copy(dst, 0, 0, bytesRead);
//             buf = dst;
//           }
//           // Readable.prototype.push = function(chunk, encoding) {
//           //   return readableAddChunk(this, chunk, encoding, false);
//           // };
//           this.push(buf);
//         } else {
//           this.push(null); // this is what calls stream.on('end', () => {after this reading is finished})
//         }
//       });
//   };

// flowing mode
readStream.on('data', (chunk) => {
    console.log('Chunk: ', chunk, 'Chunksize: ', chunk.length);
});

readStream.on('end', () => {
    console.log('Reading finished');
});

readStream.pause()


// paused stream
process.stdin.on('data', (chunk) => {
    if (chunk.toString().trim() === 'stop') {
        process.exit()
    } else {
        process.stdout.write(chunk);
        readStream.read()
    }
});
