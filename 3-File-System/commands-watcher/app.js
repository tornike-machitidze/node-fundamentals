// This app listens chnages in commands.txt file
// based on chnages it executes the commands

// async generator which is returned from watch() function
// generates new object on every commnads.txt file chnage
// and object always containes two things : event / the type of event happend to the commands file and filename
// { event: 'change', filename: 'commands.txt' }
// { event: 'delete', filename: 'commands.txt' }

const { watch, open } = require('node:fs/promises');
const { join } = require('node:path');

class App {
  // private readonly file: string;
  // private readonly eventGenerator: object;

  constructor(filePath) {
    this.file = join(__dirname, filePath);
    this.eventsAsyncGenerator = watch(this.file);
  }

  // private
  async createFile(path) {
    try {
      const fd = await open(path, 'wx');
      fd.close();
      console.log('File was successfuly created!');
    } catch (error) {
      console.log('file already exists')
    }
  }

  async deleteFile (path) {
    console.log('delete file');
  }

  // private
  async readFile(filePath) {
    // open file for reading. open returns a FD (file handle)
    const fd = await open(filePath, 'r');

    try {
      const size = (await fd.stat()).size; // statistci of the file
      const buffer = Buffer.alloc(size); //A buffer that will be filled with the file data read.
      const offset = 0; // The location in the buffer at which to start filling.
      const length = buffer.byteLength; // The number of bytes to read.
      const possition = 0; // The location where to begin reading data from the file. If null, data will be read from the current file position, and the position will be updated. If position is an integer, the current file position will remain unchanged.
      await fd.read(buffer, offset, length, possition);

      return buffer.toString('utf8').trim();
    } catch (error) {
      console.log('File was not read', error);
    } finally {
      fd.close();
    }
  }

  async execCommand() {
    const content = await this.readFile(this.file);
    const [command, filename] = content.split(' ');

    switch (command) {
      case 'create':
        await this.createFile(filename);
        break;
      case 'delete':
        await this.deleteFile(filename);
        break;
      default:
        console.log('Command was not found');
        break;
    }
  }

  async watch() {
     for await ( let event of this.eventsAsyncGenerator ) {
        console.log(event); // { eventType: 'change', filename: 'commands.txt' }

        if(event.eventType === 'change') {
          this.execCommand();
        }
     }
  }
}

const watcher = new App('commands.txt');
watcher.watch();