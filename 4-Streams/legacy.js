const { EE } = require('events');

// implementation of pipe in source code
class Stream extends EE {

  pipe(dest, options) {

    function ondata(chunk) {
      if (dest.writebale && dest.write(chunk) === false && this.pause) {
        this.pause();
      }
    }

    this.on('data', ondata);

    function ondrain() {
      if (this.readable && this.resume) {
        this.resume();
      }
    }

    dest.on('drain', ondrain);
  }
}