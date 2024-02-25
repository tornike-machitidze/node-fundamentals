// const fs = require('fs');

// 1. when we require fs module we require this huge functionality/methods from the lib/fs.js file
module.exports = fs = {
  appendFile,
  appendFileSync,
  access,
  accessSync,
  chown,
  chownSync,
  chmod,
  chmodSync,
  close,
  closeSync,
  copyFile,
  copyFileSync,
  cp,
  cpSync,
  createReadStream,
  createWriteStream,
  exists,
  existsSync,
  fchown,
  fchownSync,
  fchmod,
  fchmodSync,
  fdatasync,
  fdatasyncSync,
  fstat,
  fstatSync,
  fsync,
  fsyncSync,
  ftruncate,
  ftruncateSync,
  futimes,
  futimesSync,
  lchown,
  lchownSync,
  lchmod: constants.O_SYMLINK !== undefined ? lchmod : undefined,
  lchmodSync: constants.O_SYMLINK !== undefined ? lchmodSync : undefined,
  link,
  linkSync,
  lstat,
  lstatSync,
  lutimes,
  lutimesSync,
  mkdir,
  mkdirSync,
  mkdtemp,
  mkdtempSync,
  open,
  openSync,
  openAsBlob,
  readdir,
  readdirSync,
  read,
  readSync,
  readv,
  readvSync,
  readFile,
  readFileSync,
  readlink,
  readlinkSync,
  realpath,
  realpathSync,
  rename,
  renameSync,
  rm,
  rmSync,
  rmdir,
  rmdirSync,
  stat,
  statfs,
  statSync,
  statfsSync,
  symlink,
  symlinkSync,
  truncate,
  truncateSync,
  unwatchFile,
  unlink,
  unlinkSync,
  utimes,
  utimesSync,
  watch,
  watchFile,
  writeFile,
  writeFileSync,
  write,
  writeSync,
  writev,
  writevSync,
  Dirent,
  Stats,

  get ReadStream() {
      lazyLoadStreams();
      return ReadStream;
  },

  set ReadStream(val) {
      ReadStream = val;
  },

  get WriteStream() {
      lazyLoadStreams();
      return WriteStream;
  },

  set WriteStream(val) {
      WriteStream = val;
  },

  // Legacy names... these have to be separate because of how graceful-fs
  // (and possibly other) modules monkey patch the values.
  get FileReadStream() {
      lazyLoadStreams();
      return FileReadStream;
  },

  set FileReadStream(val) {
      FileReadStream = val;
  },

  get FileWriteStream() {
      lazyLoadStreams();
      return FileWriteStream;
  },

  set FileWriteStream(val) {
      FileWriteStream = val;
  },

  // For tests
  _toUnixTimestamp: toUnixTimestamp,
};

// let see first example.
// OPEN
const { open, read, stat } = require('fs');

open('./Readme.md', 'r', (err, fd) => {
  stat('./Readme.md', (err, { size }) => {
      if (err) console.log(err);

      const buffer = Buffer.alloc(size);

      read(fd, (err, bytesRead, buf) => {
          if(err) console.log(err)

          console.log( bytesRead, buf);
      });
  });
});

/**
* Asynchronously opens a file.
* @param {string | Buffer | URL} path
* @param {string | number} [flags]
* @param {string | number} [mode]
* @param {(
*   err?: Error,
*   fd?: number
*   ) => any} callback
* @returns {void}
*/
function open(path, flags, mode, callback) {
  path = getValidatedPath(path);
  if (arguments.length < 3) {
      callback = flags;
      flags = 'r';
      mode = 0o666;
  } else if (typeof mode === 'function') {
      callback = mode;
      mode = 0o666;
  } else {
      mode = parseFileMode(mode, 'mode', 0o666);
  }
  const flagsNumber = stringToFlags(flags);
  callback = makeCallback(callback);

  const req = new FSReqCallback();
  req.oncomplete = callback;

  binding.open(pathModule.toNamespacedPath(path), flagsNumber, mode, req);
}

// const binding = internalBinding('fs');
// const { FSReqCallback } = binding;

// uses c++ for opening the file.


// let see what this read() function does behinde the scene
function read(fd, buffer, offsetOrOptions, length, position, callback) {
  fd = getValidatedFd(fd);

  let offset = offsetOrOptions;
  let params = null;
  if (arguments.length <= 4) {
    if (arguments.length === 4) {
      // This is fs.read(fd, buffer, options, callback)
      validateObject(offsetOrOptions, 'options', { nullable: true });
      callback = length;
      params = offsetOrOptions;
    } else if (arguments.length === 3) {
      // This is fs.read(fd, bufferOrParams, callback)
      if (!isArrayBufferView(buffer)) {
        // This is fs.read(fd, params, callback)
        params = buffer;
        ({ buffer = Buffer.alloc(16384) } = params ?? kEmptyObject);
      }
      callback = offsetOrOptions;
    } else {
      // This is fs.read(fd, callback)
      callback = buffer;
      buffer = Buffer.alloc(16384);
    }

    if (params !== undefined) {
      validateObject(params, 'options', { nullable: true });
    }
    ({
      offset = 0,
      length = buffer?.byteLength - offset,
      position = null,
    } = params ?? kEmptyObject);
  }

  validateBuffer(buffer);
  callback = maybeCallback(callback);

  if (offset == null) {
    offset = 0;
  } else {
    validateInteger(offset, 'offset', 0);
  }

  length |= 0;

  if (length === 0) {
    return process.nextTick(function tick() {
      callback(null, 0, buffer);
    });
  }

  if (buffer.byteLength === 0) {
    throw new ERR_INVALID_ARG_VALUE('buffer', buffer,
                                    'is empty and cannot be written');
  }

  validateOffsetLengthRead(offset, length, buffer.byteLength);

  if (position == null)
    position = -1;

  validatePosition(position, 'position');

  function wrapper(err, bytesRead) {
    // Retain a reference to buffer so that it can't be GC'ed too soon.
    callback(err, bytesRead || 0, buffer);
  }

  const req = new FSReqCallback();
  req.oncomplete = wrapper;

  binding.read(fd, buffer, offset, length, position, req);
}


//   binding.read(fd, buffer, offset, length, position, req);
// for reading it also uses binding from c++

async function read(handle, bufferOrParams, offset, length, position) {
  let buffer = bufferOrParams;
  if (!isArrayBufferView(buffer)) {
    // This is fh.read(params)
    if (bufferOrParams !== undefined) {
      validateObject(bufferOrParams, 'options', { nullable: true });
    }
    ({
      buffer = Buffer.alloc(16384),
      offset = 0,
      length = buffer.byteLength - offset,
      position = null,
    } = bufferOrParams ?? kEmptyObject);

    validateBuffer(buffer);
  }

  if (offset !== null && typeof offset === 'object') {
    // This is fh.read(buffer, options)
    ({
      offset = 0,
      length = buffer.byteLength - offset,
      position = null,
    } = offset);
  }

  if (offset == null) {
    offset = 0;
  } else {
    validateInteger(offset, 'offset', 0);
  }

  length |= 0;

  if (length === 0)
    return { __proto__: null, bytesRead: length, buffer };

  if (buffer.byteLength === 0) {
    throw new ERR_INVALID_ARG_VALUE('buffer', buffer,
                                    'is empty and cannot be written');
  }

  validateOffsetLengthRead(offset, length, buffer.byteLength);

  if (!NumberIsSafeInteger(position))
    position = -1;

  const bytesRead = (await binding.read(handle.fd, buffer, offset, length,
                                        position, kUsePromises)) || 0;

  return { __proto__: null, bytesRead, buffer };
}

// that is what promise API returns but it still uses binding.read()
//   const bytesRead = (await binding.read(handle.fd, buffer, offset, length,
//     position, kUsePromises)) || 0;

// return { __proto__: null, bytesRead, buffer };
// {
//     __proto__:null,
//     bytesRead: bytesRead,
//     buffer: buffer
// }

// and buffer is created Buffer.alloc(16384)'


//+++++++++++++++++++++++++++++++++++++++++++++++++++
function write(fd, buffer, offsetOrOptions, length, position, callback) {
function wrapper(err, written) {
  // Retain a reference to buffer so that it can't be GC'ed too soon.
  callback(err, written || 0, buffer);
}

fd = getValidatedFd(fd);

let offset = offsetOrOptions;
if (isArrayBufferView(buffer)) {
  callback = maybeCallback(callback || position || length || offset);

  if (typeof offset === 'object') {
    ({
      offset = 0,
      length = buffer.byteLength - offset,
      position = null,
    } = offsetOrOptions ?? kEmptyObject);
  }

  if (offset == null || typeof offset === 'function') {
    offset = 0;
  } else {
    validateInteger(offset, 'offset', 0);
  }
  if (typeof length !== 'number')
    length = buffer.byteLength - offset;
  if (typeof position !== 'number')
    position = null;
  validateOffsetLengthWrite(offset, length, buffer.byteLength);

  const req = new FSReqCallback();
  req.oncomplete = wrapper;
  return binding.writeBuffer(fd, buffer, offset, length, position, req);
}

validateStringAfterArrayBufferView(buffer, 'buffer');

if (typeof position !== 'function') {
  if (typeof offset === 'function') {
    position = offset;
    offset = null;
  } else {
    position = length;
  }
  length = 'utf8';
}

const str = buffer;
validateEncoding(str, length);
callback = maybeCallback(position);

const req = new FSReqCallback();
req.oncomplete = wrapper;
return binding.writeString(fd, str, offset, length, req);
}