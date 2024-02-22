const { EventEmitter } = require('events');

const eventEmitter = new EventEmitter();

// On same event have registered 2 listeners:

// first gets 1 argument
eventEmitter.on('data', (data) => {
  console.log(data);
});

// second gets 2 arguments
eventEmitter.on('data', (data, msxali) => {
  console.log(data, msxali);
});

// call data event and give it 2 parameters
const doSomethingMeaninful = (a, b) => {
  const multiplied = a * b;

  eventEmitter.emit('data', multiplied, 'msxali');
};

doSomethingMeaninful(5, 12);

// first will log: 60
// second will log: 60 msxali