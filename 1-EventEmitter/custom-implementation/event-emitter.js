// TODO: needs to be improved

class CustomEventEmitter {
  listeners = {};

  addListener(eventName, fn) {
    return __register(this.listeners, eventName, fn);
  }

  on(eventName, fn) {
    return this.addListener(eventName, fn)
  }

  removeListener(eventName, fn) {
    return __removeListener(this.listeners, eventName, fn);
  }

  off(eventName, fn) {
    return __removeListener(this.listeners, eventName, fn);
  }

  once(eventName, fn) {
    return __registerForOnce(this.listeners, eventName, fn);
  }

  emit(eventName, ...args) {
    return __executeEvent(this, eventName, args);
  }

  listenerCount(eventName) {
    return __count(this.listeners, eventName);
  }

  // rawListeners(eventName) {}
}

function __register(events, eventType, listener) {
  const event = events[eventType];
  if (!event) {
    events[eventType] = listener;
  } else if (typeof event === 'function') {
    events[eventType] = [event, listener];
  } else if (event.length) {
    event.push(listener);
  } else if (typeof event.cb === 'function') {
    event.cb = [event.cb, listener];
  } else if (event.cb.length) {
    event.cb.push(listener);
  }


  return true;
}

function __removeListener(events, eventType, listener) {
  const event = events[eventType];
  if (!event) return false;
  if (typeof event === 'function') {
    delete events[eventName];
  } else if (event.length) {
    event = event.filter(ev => ev !== listener);
  } else if (event.once && event.once === listener) {
    delete event.once;
  } else if (event.once.length) {
    event.once = event.once.filter(e => e !== listener);
  } else if (event.cb && event.cb === listener) {
    delete event.cb;
  } else if (event.cb.length) {
    event.cb = event.cb.filter(e => e !== listener);
  }

  return true;
}

function __registerForOnce(events, eventName, listener) {
  const event = events[eventName];
  if (!event) {
    events[eventName] = { once: listener };
  } else if (typeof event === 'function' || event.length) {
    events[eventName] = { once: listener, cb: event };
  } else if (event.once && typeof event.once === 'function') {
    event.once = [event.once, listener];
  } else if (event.once && event.once.length) {
    event.once.push(listener);
  }

  return true;
}

function __executeEvent(instance, eventName, args) {
  const event = instance.listeners[eventName];
  if (!event) return false;

  if (typeof event === 'function') {
    event.apply(instance, args);
  } else if (event.length) {
    const listeners = [...event];
    for (let i = 0; i < listeners.length; i++) {
      listeners[i].apply(instance, args);
    }

  } else if (event.once && typeof event.once === 'function') {
    event.once.apply(instance, args);
    delete event.once;

    if (event.cb && typeof event.cb === 'function') {
      event.cb.apply(instance, args);
    } else if (event.cb && event.cb.length) {
      const listeners = [...event.cb];
      for (let i = 0; i < listeners.length; i++) {
        listeners[i].apply(instance, args);
      }
    }

  } else if (event.once && event.once.length) {
    console.log('here::: ', event.once);

    for (let i = 0; i < event.once.length; i++) {
      event.once[i].apply(instance, args);
    }

    delete event.once;

    if (event.cb && typeof event.cb === 'function') {
      event.cb.apply(instance, args);
    } else if (event.cb && event.cb.length) {
      const listeners = [...event.cb];
      for (let i = 0; i < listeners.length; i++) {
        listeners[i].apply(instance, args);
      }
    }
  }

}

function __count(events, eventName) {
  const event = events[eventName];
  if (!event) return 0;
  if (typeof event === 'function') {
    return 1;
  } else if (event.length) {
    return event.length;
  } else if (event.once && typeof event.once === 'function') {
    if (!event.cb) {
      return 1;
    } else if (typeof event.cb === 'function') {
      return 2;
    } else if (event.cb.length) {
      return event.cb.length + 1;
    }
  } else if (event.once && event.once.length) {
    if (!event.cb) {
      return event.once.length;
    } else if (typeof event.cb === 'function') {
      return event.once.length + 1;
    } else if (event.cb.length) {
      return event.cb.length + event.once.length;
    }
  }

  return 0;

}

const ee = new CustomEventEmitter();

ee.once('data', (data) => {
  console.log(data);
});