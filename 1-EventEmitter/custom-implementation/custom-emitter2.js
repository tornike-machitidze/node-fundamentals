class EventEmitter {
  constructor() {
    this.listeners = {};
  }

  addListener(eventName, listener) {
    return this._addListener(eventName, listener);
  }

  on(eventName, listener) {
    return this._addListener(eventName, listener);
  }

  removeListener(eventName, listener) {
    return this._removeListener(eventName, listener);
  }

  off(eventName, listener) {
    return this._removeListener(eventName, listener);
  }

  once(eventName, listener) {
    const onceWrapper = this._onceWrap(eventName, listener);
    this.on(eventName, onceWrapper);

    return this;
  }

  emit(eventName, ...args) {
    const handler = this.listeners[eventName];
    if (handler === undefined) {
      return false;
    } else {
      if (typeof handler === 'function') {
        handler.apply(this, args);
      } else {
        for (let i = 0; i < handler.length; ++i) {
          handler[i].apply(this, args);
        }
      }
    }
  }

  listenerCount(eventName) {
    const evlistener = this.listeners[eventName];
    if (evlistener === undefined) return 0;

    if (typeof evlistener === 'function') return 1;

    return evlistener.length;
  }

  rawListeners(eventName) {
    const evlistener = this.listeners[eventName];
    if (evlistener === undefined) return [];

    if (typeof evlistener === 'function') return [evlistener];

    return evlistener;
  }

  _addListener(eventName, listener) {
    if (typeof listener !== 'function') throw new Error('Make sure that listener is a function');

    const existing = this.listeners[eventName];
    if (existing === undefined) {
      this.listeners[eventName] = listener;
    } else {
      if (typeof existing === 'function') {
        this.listeners[eventName] = [existing, listener];
      } else {
        existing.push(listener);
      }
    }

    return this;
  }

  _removeListener(eventName, listener) {
    if (typeof listener !== 'function') throw new Error('Make sure that listener is a function');

    const list = this.listeners[eventName];
    if (list === undefined) return this;

    if (list === listener) {
      delete this.listeners[eventName];
    } else if (Array.isArray(list)) {
      const index = list.indexOf(listener);
      if (index !== -1) {
        list.splice(index, 1); // remove one element at index
      }
      if (list.length === 1) {
        this.listeners[eventName] = list[0];
      } else if (list.length === 0) {
        delete this.listeners[eventName];
      }
    }

    return this;
  }

  _onceWrap(eventName, listener) {
    const state = { fired: false, wrapFn: undefined, target: this, eventName, listener };

    const wrapped = this._onceWrapper.bind(state);
    wrapped.listener = listener;
    state.wrapFn = wrapped;
    return wrapped;
  }

  _onceWrapper() {
    if (!this.fired) {
      this.target.removeListener(this.eventName, this.wrapFn);
      this.fired = true;
      if (arguments.length === 0) return this.listener.call(this.target);
      return this.listener.apply(this.target, arguments);
    }
  }
}

const myEmitter = new EventEmitter();

function c1() {
  console.log('an event occurred!');
}

function c2() {
  console.log('yet another event occurred!');
}

myEmitter.on('eventOne', c1); // Register for eventOne
myEmitter.on('eventOne', c2); // Register for eventOne

// Register eventOnce for one-time execution
myEmitter.once('eventOnce', () => console.log('eventOnce once fired'));
myEmitter.once('init', () => console.log('init once fired'));

// Register for 'status' event with parameters
myEmitter.on('status', (code, msg) => console.log(`Got ${code} and ${msg}`));

myEmitter.emit('eventOne');

// Emit 'eventOnce' -> After this, the eventOnce will be
// removed/unregistered automatically
myEmitter.emit('eventOnce');

myEmitter.emit('eventOne');
myEmitter.emit('init');
myEmitter.emit('init'); // Will not be fired
myEmitter.emit('eventOne');
myEmitter.emit('status', 200, 'ok');

// Get listener's count
console.log(myEmitter.listenerCount('eventOne'));

// Get array of rawListeners
// Event registered with 'once()' will not be available here after the
// emit has been called
console.log(myEmitter.rawListeners('eventOne'));

// Get listener's count after removing one or all listeners of 'eventOne'
myEmitter.off('eventOne', c1);
console.log(myEmitter.listenerCount('eventOne'));
myEmitter.off('eventOne', c2);
console.log(myEmitter.listenerCount('eventOne'));

module.exports = { EventEmitter };
