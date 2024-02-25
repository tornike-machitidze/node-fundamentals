const { watch } = require('node:fs/promises');
const { join } = require('node:path');

class App {

  constructor() {}

  async watch() {
     const eventsAsyncGenerator = watch(join(__dirname, 'commands.txt'));

     for await ( let event of eventsAsyncGenerator ) {
        console.log(event);
        console.log(eventsAsyncGenerator);
     }
  }
}

const watcher = new App();
watcher.watch();