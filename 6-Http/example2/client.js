const net = require('net');

const socket = net.createConnection({ host: 'localhost', port: 8080 }, () => {
  const headHexValue = '504f5354202f6372656174652d706f737420485454502f312e310d0a436f6e74656e742d547970653a206170706c69636174696f6e2f6a736f6e0d0a436f6e74656e742d4c656e6774683a2035370d0a757365723a204a6f650d0a486f73743a206c6f63616c686f73743a383038300d0a436f6e6e656374696f6e3a206b6565702d616c6976650d0a0d0a';
  const bodyHexValue = '7b227469746c65223a22546865207469746c6520485454502050726f746f636f6c65222c22636f6e74656e74223a22436f6e74656e7420227d';
  const head = Buffer.from(headHexValue, 'hex');
  const body = Buffer.from(bodyHexValue, 'hex');
  // socket.write(head);
  // socket.write(body);
  socket.write(Buffer.concat([head, body]));
});

// 'POST /create-post HTTP/1.1/r/nContent-Type: application/json/r/nuser:............/r/n/r/n{'data': 'data'}'

// POST /create-post HTTP/1.1
// Content-Type: application/json
// user: Joe
// Host: localhost:8080
// Connection: keep-alive
// Transfer-Encoding: chunked
//
// { 'data': [456] }

socket.on('data', (chunk) => {
  console.log(chunk.toString());
  socket.end();
});

socket.on('end', () => {
  console.log('connection end!');
});

// 0000   50 4f 53 54 20 2f 63 72 65 61 74 65 2d 70 6f 73   POST /create-pos
// 0010   74 20 48 54 54 50 2f 31 2e 31 0d 0a 43 6f 6e 74   t HTTP/1.1..Cont
// 0020   65 6e 74 2d 54 79 70 65 3a 20 61 70 70 6c 69 63   ent-Type: applic
// 0030   61 74 69 6f 6e 2f 6a 73 6f 6e 0d 0a 43 6f 6e 74   ation/json..Cont
// 0040   65 6e 74 2d 4c 65 6e 67 74 68 3a 20 35 37 0d 0a   ent-Length: 57..
// 0050   75 73 65 72 3a 20 4a 6f 65 0d 0a 48 6f 73 74 3a   user: Joe..Host:
// 0060   20 6c 6f 63 61 6c 68 6f 73 74 3a 38 30 38 30 0d    localhost:8080.
// 0070   0a 43 6f 6e 6e 65 63 74 69 6f 6e 3a 20 6b 65 65   .Connection: kee
// 0080   70 2d 61 6c 69 76 65 0d 0a 0d 0a                  p-alive....

// 0000   7b 22 74 69 74 6c 65 22 3a 22 54 68 65 20 74 69   {"title":"The ti
// 0010   74 6c 65 20 48 54 54 50 20 50 72 6f 74 6f 63 6f   tle HTTP Protoco
// 0020   6c 65 22 2c 22 63 6f 6e 74 65 6e 74 22 3a 22 43   le","content":"C
// 0030   6f 6e 74 65 6e 74 20 22 7d                        ontent "}

// 504f5354202f6372656174652d706f737420485454502f312e310d0a436f6e74656e742d547970653a206170706c69636174696f6e2f6a736f6e0d0a757365723a204a6f650d0a486f73743a206c6f63616c686f73743a383038300d0a436f6e6e656374696f6e3a206b6565702d616c6976650d0a5472616e736665722d456e636f64696e673a206368756e6b65640d0a0d0a