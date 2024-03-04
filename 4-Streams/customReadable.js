const { Readable } = require('stream');

// Readable extends Stream extends EventEmitter

class ReadableStream extends Readable {
  constructor(o, options) {
    super(options);
    this.toStream = o;
  }


  _read(highWaterMarkvalue) {

    if (typeof this.toStream === 'object') {
      let keys = Object.keys(this.toStream);

      for (let i = 0; i < keys.length; i++) {
        const value = this.toStream[keys[i]];
        const buff = Buffer.alloc(highWaterMarkvalue);

        buff.write(value);

        if (value.length !== highWaterMarkvalue) {
          const dst = Buffer.allocUnsafe(value.length);

          buff.copy(dst, 0, 0, value.length);

        }
        this.push(buff);
      }
    }

    this.push(null);
  }
}

const obj = { a: 'abcdefghijklmnopqrstuvwxyz', b: 'b' };
const meaningLessStream = new ReadableStream(obj, { highWaterMark: 10 });

meaningLessStream.on('data', (chunk) => {
  console.log(chunk.toString());
});