// File descriptor is just a number which refers to the file

const fs = require('node:fs/promises');
const path = require('node:path');
// Or const fs = require('fs').promises before v14.
async function example() {
  let filehandle;
  try {
    filehandle = await fs.open(path.join(__dirname, './3-fileHandle.js'), 'r');
    console.log(filehandle.fd);
    console.log(await filehandle.readFile({ encoding: 'utf8' }));
  } catch(err) {
    console.log(err);
  } finally {
    if (filehandle) await filehandle.close();
  }
}

example();