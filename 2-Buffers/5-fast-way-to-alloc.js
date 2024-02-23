const { Buffer } = require('Buffer');

// ZERO filled
const buffer = Buffer.alloc(1000, 'hello'); // creates 1000 length buffer and also fills it with 0
//

// why it is Unsafe
// it can be filled any data from memory token maybe
const faster = Buffer.allocUnsafe(1000); // it is not zero filled

for( let i = 0; i < faster.length; i++ ) {
  if(faster[i] !== 0) {
    console.log('Element at position ' + i + ' has value: ' + faster[i].toString(2));
  }
}
console.log(faster);

// Buffer.from()
// Buffer.concat()
// they are using allocUnsafe but you are filling the buffer imediatly
