# 1. what is EventEmitter ?

Event emitter is a class in node.js which allows node.js event driven programing paradigm. Event-driven programing paradigm allows objects indirectly comunicate to each other, using kind a message calls.

# 2. What module allows to use EventEmitter ?

module name is 'events'
and we should use EventEmitter as :
const events = require('events')
class MyEmitter extends events.EventEmitter {}
const instance = new MuEmitter()

# 3. What are the different ways to register new events and listeners ?

there are five different ways to register new listener or create new event and register new listener for this event.

1 - .addListener(event, listener)
2 - .on(event, listener)
3 - .prependListener(event, listener)
4 - .once(event, listener)
5 - .prependOnceListener(event, listener)

# 4. What are the wayes to remove listener?

1 - .off / .removeListener
2 - .removeAllListener()

# 5. how off /removeListener and removeAllListeneer works?

off and removeListener needs event name and listener as parameter.required.
remove only one the specified listener.
removeAllListener() can specifi event name and removes all the listener from that event. or not specoified and removes all the events and listeners. cleans up the event emitter instance.

# 6. Can we register multiple listeners on one event?

yes we can register multiple listeneres on one event type.
for example: if event name is event1 it can have multiple listeners.

# 7. How to check waht is the max listeners count?

eventemitterInstance.getMaxListeners()

# 8. How much listeners can have one event type?

by default each event type can have 10 listeners.

# 9. Can we increase size of the listeners count for each event type ?

yes we can change the listeners size by invoce setMaxListeners from the instance.

# 10. If we do not know how much is listeners count but want to increase it by one how can we achive this ?

eventemitter.setMaxListeners(eventemitter.getMaxListeners() + 1)

# 11. If we have 10 listeners for one type of event and another 10 for another type of event will it throw error ?

no it will not because maxListeners works for only one type of events

# 12. Do we have same kind of restriction for event types count?

we can register as many different type events as we want, restriction is only for listeners for each event type we can only have 10 listeners by default.
but we can easily change it by setMaxListeners(getMaxListeners() + 2) /// 12

# 13. How can we execute registered listeners ?

to execute/run registered liteners/s there is a method called emmit(). we should run this method from the emitter instance and give it event type and parameter.

# 14. How listeners are executed ?

if event emitter on event type has multiple listeners they are executed syncronously. because the implementation of this part is just simple for loop from array of listeners.
the listeners are stored in array.

# 15. What does .once() method ?

once method registers the listener or listeners for event emitter but this event can be emitted only one time because after one execution this event type is removed from event emitter.

# 16. How can I get all the listeners on the specific event ?

from event emitter instance we should run eventemmiter.listeners('eventtype')

# 17. How can I get all the events types registered fpr the event emitter ?

emitter.eventNames()

# 18. what are the ways to delete listener from event ?

there are couple of ways :
1 - removeListener('event', listener)
2 - removeAllListeners(event)
3 - off(event, listener)

# 19. How to chnage max listeners number for all Event emitter ?

from events module defaultMaxListener asign new value it will change maxListeners for every eventemitter.

# 20. what eventemitter methods you know ?

1. .on() // to register an event listener
2. .addListener() // also to register an event
3. .once() // to register an event to invoke only for once

4. .off() // to remove listener, it remove listener no eventType
5. .removeListener() // does same thing
6. .removeAllListners() // removes all listeners from the event type

7. .setMaxListeners(n) // takes the number of how much should be listeners count
8. .getMaxListeners() // what is the current size of the listeners count

9. .listenerCount(eventType) // counts the regitered listener --> n
10. .eventNames() // returns all the diffenert event types
