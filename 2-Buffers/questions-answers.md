# 1. What is Buffer?

Buffer is special type of object to store fix-length sequence of bits for temporary usage. Usually to store binary data in memory.(RAM).

- usage is to store binary data in memory for proccessing.

# 2. is it a new data type in js?

NO. it is an object, but specail type.

# 3. In what format Buffer stores binary data?

Buffer stores binary data in hexadecimal format.
on each index it stores number which is representable in 1byte.
it has some common with Uint8Array cause both stores bytes (8 bits ) on each index.
so decimal representation of each index can not be more then 255.
and each index stores number represented in hex format.
[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, a, b, c, d, e, f]

# 4. why become nececary to create Buffers?

javascript itself did not has good data structure to stored zeros and ones (binary data)
so node js team implement Buffer data structure nowdays it is extendes from Uint8Arrays + all the methods and properties to simplifiy working with binary data.
to read and write and take ad achange all operations on binary data become easier.

# 5. what buffer gives us?

Buffer alocetaes fixed size memory in ram to gives us possibility to manipulate on binary data.

# 6 How to use buffer ?

Buffer class is global in Node.js but still doc says that import first. and we can use it from 'buffer' module as following
const {Buffer} = require('buffer')

# 7. How to create buffer instance/ what are the ways to create a buffer ?

there are 2 ways:
const inst1= Buffer.alloc()
const inst2 = Buffer.from()

# 8. What can Buffer.from can get as argument?

buffer.from can get array arrayBuffer string or another buffer
Buffer.from(array) // array elements should be representable in 1 byte. in eight bit so largest should be 255 and slammest 0. array entries outside the range will be trancated to fit into it.
Buffer.from(buffer)
Buffer.from(arrayBuffer[, byteOffset[, length]])
Buffer.from(string[, encoding])

# 9.What can alloc can get as filling type?

- string
- buffer
- Uint8Array
- integer default is 0

# 10. the diference is ?

first argument for alloc is size = INTEGER
for FROM is actual value

1 -from can not get number
alloc can get number to fill hole buffer
Number is the difference - default is 0

2 - also from can get any array

# 11. If I want to create new buffer fixed size of 10 but fill with nothing/or with 0s. which way should I use to create new buffer ?

Buffer.alloc() for sure
and the way will be
const buffer = Buffer.alloc(10)
By default it gets integer 0 and fill all 10 indexes with 0
<Buffer 00 00 00 00 00 00 00 00 00 00 >

# 12. what is buffer.alocUnsafe() ? and what it does?

also create new buffer an aloccs size of the buffer

# 13. What is the way to read or decode a buffer ?

toString(encodingtype)
from buffer instance .toString(encoding, start, end)

# 14. how to write data in Buffer?

.write(data) method from buffer instance
buffer.write(string, fromwhichindextostart, stringlength, encoding)

# 15. what is the way to get a part of a buffer ?

buffer.slice(start, end)

# 16. what is the way to combine buffer ?

buffer.concat(buff1, buff2)

# 17. How to chack if given object is a buffer ?

Buffer.isBuffer(obj)

# 18. how can you check if encoding is the supported encoding type?

Buffer.isEncoding(encoding)
