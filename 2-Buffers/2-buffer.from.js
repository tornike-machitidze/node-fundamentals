const { Buffer } = require('node:buffer');

// Buffer.from()
// Buffer.from(array);
// Buffer.from(buffer);
// Buffer.from(arrayBuffer[, byteOffset[, length]]);
// Buffer.from(string[, encoding]);

// From Array
const arr = [97, 65];
const buff1 = Buffer.from(arr); // buffer stores each character in hex format.
// 97 in hex is 61 and 65 is 41
// [97, 65] ==> <Byffer 61 41>
console.log(buff1);

// From buffer
const buff2 = Buffer.from(buff1);
console.log(buff2);

// FROM ArrayBuffer
const arrBuffer = new ArrayBuffer(10);
const buff3 = Buffer.from(arrBuffer);
buff3.write('abcdefghijklmn');
console.log(buff3);

const uint8Arr = new Uint8Array([23, 45, 18, 89, 95]);
uint8Arr[0] = 16;
const buff5 = Buffer.from(uint8Arr);
console.log(buff5);

// FROM String
const buff4 = Buffer.from('string');
console.log(buff4);
