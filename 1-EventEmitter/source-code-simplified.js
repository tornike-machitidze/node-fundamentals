//==========================================================

// Much of the Node.js core API is built around an idiomatic
// asynchronous event-driven architecture in which certain kinds of objects
// (called "emitters") emit named events that cause Function objects ("listeners") to be called.

// ========================================================

// For instance: a net.Server object emits an event each time a peer connects to it; a fs.ReadStream emits
//  an event when the file is opened; a stream emits an event whenever data is available to be read.

// ==========================================================

// All objects that emit events are instances of the EventEmitter class. These objects expose an eventEmitter.on()
//function that allows one or more functions to be attached to named events emitted by the object. Typically,
//event names are camel-cased strings but any valid JavaScript property key can be used.

// ========================================================

// When the EventEmitter object emits an event, all of the functions attached to that specific event are called
//synchronously. Any values returned by the called listeners are ignored and discarded.

// The following example shows a simple EventEmitter instance with a single listener. The eventEmitter.on()
//method is used to register listeners, while the eventEmitter.emit() method is used to trigger the event.

//=======================================  Event Emitter =================
//                                              ||
//                                              ||
//                    __________________________||________________________
//                    |                                                  |
//                   \/                                                 \/
//_________________________________________________________ _________________________________________________
//           on (instance, eventName, listener ) {        | | emit (event) {
//                                                        | |
//                   this._events = {                     | |    this._events[event].forEach(listener => {
//                       eventName: [ listener ]          | |        listener.apply(this)
//                }                                       | |    })
//________________________________________________________| |}________________________________________________

// ======================== Source Code ====================
//==============================================
// Creation of EventEmitter constructor function
function EventEmitter(opts) {
  EventEmitter.init.call(this, opts);
}

//================================
// add in prototype addListener method
EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

// =====================================
// assign on method to the addListener method they are the same
EventEmitter.prototype.on = EventEmitter.prototype.addListener;

// =======================what addListener calls is _addListeenr
// which regsiters the listeners in the _events: { } property which is object
// _events: { event1: [ cb1, cb2 ] }
function _addListener(target, type, listener, prepend) {
  let m;
  let events;
  let existing;

  checkListener(listener);

  events = target._events;
  if (events === undefined) {
      events = target._events = { __proto__: null };
      target._eventsCount = 0;
  } else {
      // To avoid recursion in the case that type === "newListener"! Before
      // adding it to the listeners, first emit "newListener".
      if (events.newListener !== undefined) {
          target.emit('newListener', type, listener.listener ?? listener);

          // Re-assign `events` because a newListener handler could have caused the
          // this._events to be assigned to a new object
          events = target._events;
      }
      existing = events[type];
  }

  if (existing === undefined) {
      // Optimize the case of one listener. Don't need the extra array object.
      events[type] = listener;
      ++target._eventsCount;
  } else {
      if (typeof existing === 'function') {
          // Adding the second element, need to change to array.
          existing = events[type] = prepend ? [listener, existing] : [existing, listener];
          // If we've already got an array, just append.
      } else if (prepend) {
          existing.unshift(listener);
      } else {
          existing.push(listener);
      }

      // Check for listener leak
      m = _getMaxListeners(target);
      if (m > 0 && existing.length > m && !existing.warned) {
          existing.warned = true;
          // No error code for this since it is a Warning
          const w = genericNodeError(
              `Possible EventEmitter memory leak detected. ${existing.length} ${String(type)} listeners ` +
                  `added to ${inspect(target, { depth: -1 })}. Use emitter.setMaxListeners() to increase limit`,
              { name: 'MaxListenersExceededWarning', emitter: target, type: type, count: existing.length }
          );
          process.emitWarning(w);
      }
  }

  return target;
}

// ================================ create new method emit in prototype which calls listeners
// Execute event listeners
EventEmitter.prototype.emit = function emit(type, ...args) {
  let doError = type === 'error';

  const events = this._events;
  if (events !== undefined) {
      if (doError && events[kErrorMonitor] !== undefined) this.emit(kErrorMonitor, ...args);
      doError = doError && events.error === undefined;
  } else if (!doError) return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
      let er;
      if (args.length > 0) er = args[0];
      if (er instanceof Error) {
          try {
              const capture = {};
              ErrorCaptureStackTrace(capture, EventEmitter.prototype.emit);
              ObjectDefineProperty(er, kEnhanceStackBeforeInspector, {
                  __proto__: null,
                  value: FunctionPrototypeBind(enhanceStackTrace, this, er, capture),
                  configurable: true,
              });
          } catch {
              // Continue regardless of error.
          }

          // Note: The comments on the `throw` lines are intentional, they show
          // up in Node's output if this results in an unhandled exception.
          throw er; // Unhandled 'error' event
      }

      let stringifiedEr;
      try {
          stringifiedEr = inspect(er);
      } catch {
          stringifiedEr = er;
      }

      // At least give some kind of context to the user
      const err = new ERR_UNHANDLED_ERROR(stringifiedEr);
      err.context = er;
      throw err; // Unhandled 'error' event
  }

  const handler = events[type];

  if (handler === undefined) return false;

  if (typeof handler === 'function') {
      const result = handler.apply(this, args);

      // We check if result is undefined first because that
      // is the most common case so we do not pay any perf
      // penalty
      if (result !== undefined && result !== null) {
          addCatch(this, result, type, args);
      }
  } else {
      /***       Part where multipal listeners are executed syncronously using for loop      */
      /***       listeners are stored in js array and when emit('eventname')  is called for loop goes each by one     */
      /***       syncronously and executes them    */
      const len = handler.length;
      const listeners = arrayClone(handler);
      for (let i = 0; i < len; ++i) {
          const result = listeners[i].apply(this, args);

          /***          */
          /***          */
          /***          */
          /***          */
          /***          */
          /***          */
          /***          */

          // We check if result is undefined first because that
          // is the most common case so we do not pay any perf
          // penalty.
          // This code is duplicated because extracting it away
          // would make it non-inlineable.
          if (result !== undefined && result !== null) {
              addCatch(this, result, type, args);
          }
      }
  }

  return true;
};

module.exports = EventEmitter;
