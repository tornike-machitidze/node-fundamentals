// what is going behind the scene
const buffer = Buffer.alloc(2, 'hi', 'UTF8'); // <Buffer 68 69>


//                  ||
//                  \/

// 1. Buffer.alloc(size, fill, encoding)
// source code
/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 */
Buffer.alloc = function alloc(size, fill, encoding) {
    assertSize(size);
    if (fill !== undefined && fill !== 0 && size > 0) {
      const buf = createUnsafeBuffer(size);
      return _fill(buf, fill, 0, buf.length, encoding);
    }
    return new FastBuffer(size);
  };

//   if (fill !== undefined && fill !== 0 && size > 0) {
//     const buf = createUnsafeBuffer(size);
//     return _fill(buf, fill, 0, buf.length, encoding);
//   }

// 2. in our case it creates buff with createUnsafeBuffer
// const buf = createUnsafeBuffer(size);

function createUnsafeBuffer(size) {
    zeroFill[0] = 0;
    try {
      return new FastBuffer(size);
    } finally {
      zeroFill[0] = 1;
    }
  }

//  return new FastBuffer(size);
// so it returns instance of a FastBuffer class

// 3. let see what FastBuffer class looks like

class FastBuffer extends Uint8Array {
    // Using an explicit constructor here is necessary to avoid relying on
    // `Array.prototype[Symbol.iterator]`, which can be mutated by users.
    // eslint-disable-next-line no-useless-constructor
    constructor(bufferOrLength, byteOffset, length) {
      super(bufferOrLength, byteOffset, length);
    }
  }

  // as we see FastBuffer class is extended from Uint8Array

const arr = new Uint8Array([104, 105]) // typed array
const buff =Buffer.from(arr)
console.log(arr) // Uint8Array(2) [ 104, 105 ]
console.log(buff.toString('UTF8')) // hi

//===========================================================================
//===========================================================================
//===========================================================================
//===========================================================================
//===========================================================================
//===========================================================================
//===========================================================================
//===========================================================================
//===========================================================================
// Second way of creating buffer is Buffer.from('str');

const bufferObject = Buffer.from()

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 */

// 1. Buffer method 'from' gets value, encodingorOffset, length
//************** Function from creates new buffer from string or buffer or unit8array  */
Buffer.from = function from(value, encodingOrOffset, length) {
  if (typeof value === 'string')
    return fromString(value, encodingOrOffset);

  if (typeof value === 'object' && value !== null) {
    if (isAnyArrayBuffer(value))
      return fromArrayBuffer(value, encodingOrOffset, length);

    const valueOf = value.valueOf && value.valueOf();
    if (valueOf != null &&
        valueOf !== value &&
        (typeof valueOf === 'string' || typeof valueOf === 'object')) {
      return from(valueOf, encodingOrOffset, length);
    }

    const b = fromObject(value);
    if (b)
      return b;

    if (typeof value[SymbolToPrimitive] === 'function') {
      const primitive = value[SymbolToPrimitive]('string');
      if (typeof primitive === 'string') {
        return fromString(primitive, encodingOrOffset);
      }
    }
  }

  throw new ERR_INVALID_ARG_TYPE(
    'first argument',
    ['string', 'Buffer', 'ArrayBuffer', 'Array', 'Array-like Object'],
    value,
  );
};

// 2. if value is string 
// return fromString(value, encodingOrOffset);

function fromString(string, encoding) {
  let ops;
  if (typeof encoding !== 'string' || encoding.length === 0) {
    if (string.length === 0)
      return new FastBuffer();
    ops = encodingOps.utf8;
    encoding = undefined;
  } else {
    ops = getEncodingOps(encoding);
    if (ops === undefined)
      throw new ERR_UNKNOWN_ENCODING(encoding);
    if (string.length === 0)
      return new FastBuffer();
  }
  return fromStringFast(string, ops);
}

// 3. returns return fromStringFast(string, ops);
// let see
function fromStringFast(string, ops) {
  const length = ops.byteLength(string);

  if (length >= (Buffer.poolSize >>> 1))
    return createFromString(string, ops.encodingVal);

  if (length > (poolSize - poolOffset))
    createPool();
  let b = new FastBuffer(allocPool, poolOffset, length);
  const actual = ops.write(b, string, 0, length);
  if (actual !== length) {
    // byteLength() may overestimate. That's a rare case, though.
    b = new FastBuffer(allocPool, poolOffset, actual);
  }
  poolOffset += actual;
  alignPool();
  return b;
}

// return createFromString(string, ops.encodingVal);

// And createFromString() comes from c++
// internalBinding


//===========================================================================
//===========================================================================
//===========================================================================
//===========================================================================
//===========================================================================
//===========================================================================
//===========================================================================
//===========================================================================
//===========================================================================


// 4. How .toJSON() method is working under the hood
Buffer.prototype.toJSON = function toJSON() {
  if (this.length > 0) {
    const data = new Array(this.length);
    for (let i = 0; i < this.length; ++i)
      data[i] = this[i];
    return { type: 'Buffer', data };
  }
  return { type: 'Buffer', data: [] };
};

// 5. toString()

// No need to verify that "buf.length <= MAX_UINT32" since it's a read-only
// property of a typed array.
// This behaves neither like String nor Uint8Array in that we set start/end
// to their upper/lower bounds if the value passed is out of range.
Buffer.prototype.toString = function toString(encoding, start, end) {
  if (arguments.length === 0) {
    return this.utf8Slice(0, this.length);
  }

  const len = this.length;

  if (start <= 0)
    start = 0;
  else if (start >= len)
    return '';
  else
    start |= 0;

  if (end === undefined || end > len)
    end = len;
  else
    end |= 0;

  if (end <= start)
    return '';

  if (encoding === undefined)
    return this.utf8Slice(start, end);

  const ops = getEncodingOps(encoding);
  if (ops === undefined)
    throw new ERR_UNKNOWN_ENCODING(encoding);

  return ops.slice(this, start, end);
};