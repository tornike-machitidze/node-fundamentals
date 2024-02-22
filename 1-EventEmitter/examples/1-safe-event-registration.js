// Implement safe events register function
// To not to thro warrning MaxListenersExceededWarning
// if we are trying to register new event but is exceed max, first encrise by 1 and then add.

/**
 * adds listener to the eventemitter safe way
 * @param { Object } target event emitter object
 * @param { String } eventType new or existing event in this event emitter object
 * @param { Function } listener function/listener to be executed on this event emit
 */
const addListenerSafe = (target, eventType, listener) => {
  // check what is the max listeners to be registered on a event in this eventemitter object [General]
  const max = target.getMaxListeners();
  // get current count of listeners on this specific event
  const currentCount = target.listenersCount(eventType);

  // if listeners count === max increase maxListeners count by 1 in the eventemitter object
  if (currentCount === max) {
    target.setMaxListeners(currentCount + 1);
  }

  // register the event
  target.on(eventType, listener);
};

//________________________Test
class EE extends require('events').EventEmitter { }
const ee = new EE();

addListenerSafe(ee, 'ev', () => { console.log('1'); });
addListenerSafe(ee, 'ev', () => { console.log('1'); });
addListenerSafe(ee, 'ev', () => { console.log('1'); });
addListenerSafe(ee, 'ev', () => { console.log('1'); });
addListenerSafe(ee, 'ev', () => { console.log('1'); });
addListenerSafe(ee, 'ev', () => { console.log('1'); });
addListenerSafe(ee, 'ev', () => { console.log('1'); });
addListenerSafe(ee, 'ev', () => { console.log('1'); });
addListenerSafe(ee, 'ev', () => { console.log('1'); });
addListenerSafe(ee, 'ev', () => { console.log('1'); });
addListenerSafe(ee, 'ev', () => { console.log('1'); });
addListenerSafe(ee, 'ev', () => { console.log('1'); });
addListenerSafe(ee, 'ev', () => { console.log('1'); });
addListenerSafe(ee, 'ev', () => { console.log('1'); });
addListenerSafe(ee, 'ev', () => { console.log('1'); });
addListenerSafe(ee, 'ev', () => { console.log('1'); });
addListenerSafe(ee, 'ev', () => { console.log('1'); });
addListenerSafe(ee, 'ev', () => { console.log('1'); });
addListenerSafe(ee, 'ev', () => { console.log('1'); });
addListenerSafe(ee, 'ev', () => { console.log('1'); });
addListenerSafe(ee, 'ev', () => { console.log('1'); });


ee.emit('ev');