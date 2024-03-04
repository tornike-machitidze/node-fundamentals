const net = require('node:net');
const fs = require('node:fs/promises');

const server = net.createServer(async (socket) => {
  // socket is actualy the information about the computer which is connecteing our server.
  // so it knows our adress and connecting us net module grabs all the information about this client/computer
  // and creates new object called as socket.
  // so we have information about the computer in net.Socket
  console.log('net.Socket: ', socket);

  // 1. router get information IP Adress : port
  // 2. switch send send information to network card
  // 3. network card get the information and c++ code was connected to the network card so c++ app read the information
  // 4. c++ app got the information and send it to the node.js
  // 5. c++ calls the net.connection and net.connection creates the new Socket from the information c++ send
  // 6. Socket is create as a duplex stream. we can read information from the socket and we can write the information in it
  // 7. writing information in the socket will take the same way c++ --> network card --> stich --> router 
  /*
  {
  "connecting": false,
  "_hadError": false,
  "_parent": null,
  "_host": null,
  "_closeAfterHandlingError": false,
  "_readableState": {
    "state": 4184,
    "highWaterMark": 16384,
    "buffer": { "head": null, "tail": null, "length": 0 },
    "length": 0,
    "pipes": [],
    "flowing": null,
    "errored": null,
    "defaultEncoding": "utf8",
    "awaitDrainWriters": null,
    "decoder": null,
    "encoding": null
  },
  "_events": {},
  "_eventsCount": 1,
  "_writableState": {
    "state": 786508,
    "highWaterMark": 16384,
    "defaultEncoding": "utf8",
    "length": 0,
    "corked": 0,
    "writecb": null,
    "writelen": 0,
    "afterWriteTickInfo": null,
    "buffered": [],
    "bufferedIndex": 0,
    "pendingcb": 0,
    "errored": null
  },
  "allowHalfOpen": false,
  "_sockname": null,
  "_pendingData": null,
  "_pendingEncoding": "",
  "server": {
    "_events": {},
    "_eventsCount": 1,
    "_connections": 3,
    "_handle": { "reading": false },
    "_usingWorkers": false,
    "_workers": [],
    "_unref": false,
    "allowHalfOpen": false,
    "pauseOnConnect": false,
    "noDelay": false,
    "keepAlive": false,
    "keepAliveInitialDelay": 0,
    "highWaterMark": 16384,
    "_connectionKey": "4:127.0.0.1:4040"
  },
  "_server": {
    "_events": {},
    "_eventsCount": 1,
    "_connections": 3,
    "_handle": { "reading": false },
    "_usingWorkers": false,
    "_workers": [],
    "_unref": false,
    "allowHalfOpen": false,
    "pauseOnConnect": false,
    "noDelay": false,
    "keepAlive": false,
    "keepAliveInitialDelay": 0,
    "highWaterMark": 16384,
    "_connectionKey": "4:127.0.0.1:4040"
  }
}

  */

});

server.listen(4040, '127.0.0.1', () => {
  console.log('TCP app is running on loopback environmant');
});
