const { EventEmitter } = require('../task1/index');
const fetch = require('node-fetch'); // Import the fetch library for making HTTP requests

class WithTime extends EventEmitter {
  async execute(asyncFunc, ...args) {
    try {
      this.emit('begin'); // Emit 'begin' event before starting execution
      console.log('About to execute');

      const startTime = Date.now();
      const result = await asyncFunc(...args); // Execute the asynchronous function
      const endTime = Date.now();

      this.emit('data', result); // Emit 'data' event with the result
      console.log('Data:', result);

      const executionTime = endTime - startTime;
      this.emit('end', executionTime); // Emit 'end' event with execution time
      console.log(`Execution time: ${executionTime} ms`);
    } catch (error) {
      this.emit('error', error); // Emit 'error' event if an error occurs
      console.error('Error:', error);
    }
  }
}

const withTime = new WithTime();

withTime.on('begin', () => console.log('About to execute'));
withTime.on('end', (executionTime) => console.log(`Done with execute in ${executionTime} ms`));

withTime.execute(async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
  const data = await response.json();
  return data;
});
