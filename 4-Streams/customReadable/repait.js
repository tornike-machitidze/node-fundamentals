const { Readable } = require('stream');

const arr = [{ h: 'hey' }, [1, 2, 3], (x) => x + 1];

class StreamFromArray extends Readable {
    constructor(arr) {
        super({ objectMode: true }); // encoding : 'utf8' // bydefault it is Buffer
        this.array = arr;
        this.index = 0;
    }

    _read() {
        if (this.index < this.array.length) {
            const chunk = {
                data: this.array[this.index],
                index: this.index
            }
            this.push(chunk);
            this.index++;
        } else {
            this.push(null);
        }
    }
}

const stream = new StreamFromArray(arr);

stream.on('data', (chunk) => console.log(chunk));

stream.on('end', () => console.log('done'));
