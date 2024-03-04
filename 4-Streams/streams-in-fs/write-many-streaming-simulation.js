(async () => {
  let chunks = [];
  let chunksSize = 0;
  const defaultChunkSize = 16384;

  const fsPromise = require('node:fs/promises');
  const fileHandle = await fsPromise.open('./writemany.txt', 'w');

  let writeMany = 1000000;
  console.time('time')
  while (writeMany > 0) {
      const buff = Buffer.from( `a`);
      if (buff.byteLength >= defaultChunkSize) {
          if (chunks.length) await fileHandle.writev(chunks);
          await fileHandle.write(buff);
          console.log('One big chunk write, chunk size: ', buff.byteLength);

          chunks = [];
          chunksSize = 0;
      } else {
          chunksSize += buff.byteLength;

          if (chunksSize < defaultChunkSize) {
              chunks.push(buff);
          }
          // TODO:
          // else if(chunksSize > defaultChunkSize){
          //     // logic to split buffer
          //     // add possible part to the chunk
          //     // store lefted part for the next call

          // }

          if (chunksSize >= defaultChunkSize) {
              console.log('Chunk size (collected bytes count): ', chunksSize);
              await fileHandle.writev(chunks);
              chunks = [];
              chunksSize = 0;
              console.log('Drained!');
          }
      }
      writeMany--;
  }

  if (chunksSize && chunks.length) {
      await fileHandle.writev(chunks);
      chunks = [];
      chunksSize = 0;
      console.log('write a smaller data then chunk default size');
  }
  console.timeEnd('time')
})();
