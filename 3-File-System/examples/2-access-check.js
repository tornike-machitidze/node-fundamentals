// If i only want to check what access have to the file I can use fs.access method
// But not for to create new file because of racing and this perrmisions can be changed

const fs = require('node:fs');

const filePath = require('node:path').join(__dirname, '2-access-check.js')

fs.access(filePath, fs.constants.R_OK, (err) => {
  if (err) throw new Error();
  console.log('Reading is OK');
});

// Promises version
const { access, constants } = require('node:fs/promises');
const checkAccessType = async (filePath, type) => {

  try {
    await access(filePath, type);
    console.log('can access');
  } catch {
    console.error('cannot access');
  }
}

(async () => {
 await checkAccessType(filePath, constants.W_OK);
})()