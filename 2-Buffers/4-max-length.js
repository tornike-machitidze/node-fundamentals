// It is not good idea to create a Buffers of hude data
// because as I have described in .md files buffers alocates the memory.
// to store huge data in memory is not a good idea
// We should never do that.

const {constants} = require('buffer');

console.log(constants.MAX_LENGTH); // 4294967296
// the max size of buffer we can alocate by default is a 4GiB (Gebibyte)

// so Reading or writeing hude data at a time in buffer or from buffer is a BAD idea