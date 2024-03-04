// CONSTANTS : readingChunkSize && writingChunkSize
// Reading function
// handle backpressure
// stop reading if writing is not finished
// Writing function


const { EventEmitter } = require('node:events');
const { Buffer } = require('node:buffer');
const path = require('path');
const fs = require('node:fs/promises');

// NODE implementation of fs streams uses these sizes for chunks
const defaultReadChunkSize = 64 * 1024;; // internal buffer size for reading in Node.js fs read stream
const defaultWriteChunkSize = 16 * 1024; // internal buffer size for writing in node fs write stream

class EE extends EventEmitter { }
const app = new EE();

const streamingWrite = async (fd, buffer) => {
  let size = buffer.length;
  let start = 0;
  let end = defaultWriteChunkSize; // 16 kb

  while (size > defaultWriteChunkSize) {
    const chunk = buffer.slice(start, end);
    await fd.write(chunk);
    console.log('write chunk: ', chunk.length); // slice will take on indexes the bytes

    size -= chunk.length;
    start = end;
    end += chunk.length;
  }

  console.log('write last chunk: ', buffer.slice(-size).length);
  await fd.write(buffer.slice(-size));

};

const streamingRead = async (fd, destFd) => {
  let { size } = await fd.stat();
  let position = 0; // from what position to start reading
  while (size > defaultReadChunkSize) {
    const bufferToReadInTo = Buffer.alloc(defaultReadChunkSize);
    let offset = 0;
    let length = defaultReadChunkSize;
    await fd.read(bufferToReadInTo, offset, length, position);
    console.log('Read chunk: ', bufferToReadInTo.length);
    await streamingWrite(destFd, bufferToReadInTo);
    size -= defaultReadChunkSize;
    position += defaultReadChunkSize;
  }

  if (size) {
    const bufferToReadInTo = Buffer.alloc(size);
    const offset = 0;
    const length = size;
    await fd.read(bufferToReadInTo, offset, length, position);
    console.log('Read last chunk: ', bufferToReadInTo.length);
    await streamingWrite(destFd, bufferToReadInTo);
  }

};

const streaming = async (source, dest) => {
  const readFileHandle = await fs.open(source, 'r');
  const writeFileHandle = await fs.open(dest, 'w');
  const { size } = (await readFileHandle.stat());
  console.log('Source file size is : ', size);

  // if file size is less than read chunk size
  if (size < defaultReadChunkSize) {
    const bufferToReadIn = Buffer.alloc(size); //  A buffer that will be filled with the file data read.
    const offset = 0; //The location in the buffer at which to start filling.
    const length = size; //The number of bytes to read.
    const position = 0; //The location where to begin reading data from the file.

    await readFileHandle.read(bufferToReadIn, offset, length, position);

    console.log('Read chunk: ', bufferToReadIn);

    if (size > defaultWriteChunkSize) {
      await streamingWrite(writeFileHandle, bufferToReadIn);
    } else {
      console.log('write chunk: ', bufferToReadIn.length);
      await writeFileHandle.write(bufferToReadIn);

      await readFileHandle.close();
      await writeFileHandle.close();
    }

  } else {
    await streamingRead(readFileHandle, writeFileHandle);
    await readFileHandle.close();
    await writeFileHandle.close();
  }

};

const readFilePath = path.join(__dirname, '../../Node.JS/Node.Js Tutorials/File-Systems/fsStreams', 'video.mp4');
const writeFilePath = path.join(__dirname, 'dest.mp4');

app.on('streaming', streaming);

app.emit('streaming', readFilePath, writeFilePath);