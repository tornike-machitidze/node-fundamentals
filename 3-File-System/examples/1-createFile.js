// I want to make sure that I create new file and if there was already the file let me know
// const fs = require('node:fs/promises');
const fsPromises = require("node:fs/promises");
const createFile = async (path) => {
  try {
   const newFileHandle = await fsPromises.open(path, 'wx');
   newFileHandle.close();

   return `New file was successfully created`
  } catch (error) {
    return `File ${path} already exists`
  }
}

(async() => {
  console.log( await createFile('./test.txt'));
})();

// if we run this file twice
// first: New file was successfully created
// second: File ./test.txt already exists
