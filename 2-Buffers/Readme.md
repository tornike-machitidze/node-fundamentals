# Buffer:

      Buffer special type of objects are used to represent a fixed-length sequence of bytes.

Buffers are temporary holding containers of the binary data.
Buffers stores data as hexadecimal format.
for Each character representation it uses 1byte (8bit) 00 (each 0 represents a bit 0000 0000)
largest umber it can store in one byte is ff in hexadecimal wich is 1111 1111 in binary and which is 255 in decimal

Mostly Buffers are wrapped by Streams, every time we habndle to upload video, send a file we are using buffers but we do not touch it directly but using streams which uses Buffer for this operations.

## Interesing Facts
1. Buffer is a subclass of Uint8Array : => (ES6 introduced Uint8Array: a typed array where eah element in this array is 8 bit)
   class FastBuffer extends Uint8Array {}
   FastBuffer.prototype.constructor = Buffer;
   Buffer.prototype = FastBuffer.prototype;
2. Improves performance of allocating unsafe buffers, creating buffers from
   an existing ArrayBuffer and creating .slice(...) from existing Buffer by
   avoiding deoptimizing change of prototype after Uint8Array allocation
   in favor of ES6 native subclassing.
3. Javascript itself didnot has good way of handling binary data. ( way to store lots of zeros and ones structuruly )
   So backend language needs to easily manipulate binary data. store it. change it. write it.
   So for these reasons created Buffer. FastBuffer.
   It stores binary data for temporary usage in RAM.
   To get content of the files and store for manipulate.
4. Buffer uses not binary format of storing data bat Hexadecimal.
   <Buffer ff 00> == uint8Array(1)[255, 0]
5. Each value is 1byte === 8bit representation of the binary data.

`Node:doc: Buffer objects are used to represent a fixed-length sequence of bytes. Many Node.js APIs support Buffers.

The Buffer class is a subclass of JavaScript's Uint8Array class and extends it with methods that cover additional use cases. Node.js APIs accept plain Uint8Arrays wherever Buffers are supported as well.

While the Buffer class is available within the global scope, it is still recommended to explicitly reference it via an import or require statement. `

Buffering the data is Encoding the data with Hexadecimal System
To get back you need Decoding the buffer

Quick reminder.

1. Character Sets: symbols used in writin system, assigned to that symbols character codes (unique numbers).
   What symbols we have ?
2. Character Encoding: representation of the symbols in 0 and 1 to store the data in computer or send in network.
   How to store in computer ?
3. Character Decoding: get the symbols back from 0 and 1.
   How can we get back the data ?

When You Create A Buffer You always DO -------------> ENCODING
Create a Buffer ==== ENCODING

Buffer Methods.

1. Buffer.alloc()
2. Buffer.from()

3. Buffer.write()

4. Buffer.byteLength()
5. Buffer.compare()
6. Buffer.concat()
7. buf.entries()
8. Buffer.fill()
9. buf.includes()
10. Buffer.isEncoding()

instance methods

1. buffer.write()
2. buffer.compare()
3. buffer.toString()
