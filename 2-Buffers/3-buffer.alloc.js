const { Buffer } = require('buffer');

const buff1 = Buffer.alloc(10, 28);
// creates new buffer fix size of 10 byte and fills all 10 index with hex representation of 28 which is 1c
console.log(buff1); // <Buffer 1c 1c 1c ...>

const buff2 = Buffer.alloc(10, new Uint8Array([255]));
console.log(buff2); // takes the elememtns from the array if it is less fills hole 10m index whith those values represented in hex

const buff3 = Buffer.alloc(6, 'string'); // create new buffer instance allocate 6 byte size for that and fill with characters of string
// each character code represent in hex number
console.log(buff3);//<Buffer 73 74 72 69 6e 67>

