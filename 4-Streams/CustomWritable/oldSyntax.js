const { Writable } = require('node:stream');
const { inherits } = require('util');

function WriteStream(options) {
    if (!(this instanceof WriteStream)) {
        return new WriteStream(options);
    }

    Writable.call(this, options);
}

inherits(WriteStream, Writable);
