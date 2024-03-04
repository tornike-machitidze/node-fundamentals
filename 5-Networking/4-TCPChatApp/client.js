// TCP Client
const net = require('node:net');

// Readline allows us to read from readable stream one line at atime.
const readline = require('readline/promises');
// create an instance for reading from stdin readable stream and output it in stdout writabale stream.
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

// VARIABLES
const PORT = 4080;
const HOST = '127.0.0.1';

//TTY text based Terminal. Helps to comunicate with terminal. 

//stdout.clearLine gets direqtion and clears the line. Direction is number 1 0 -1
// 1 clears the line right of the cursor, 0 clears the entire line, -1 clears leftside of the cursor.
const clearLine = (dir) => {
    // returns new Promise. resolved inside the cb.
    return new Promise((resolve, reject) => {
        // we still use Callback API but with Promise maner
        process.stdout.clearLine(dir, () => {
            // just resolves inside the cb.
            resolve();
        });
    });
};

// move cursor
const moveCursor = (dx, dy) => {
    // returns new Promise. resolved inside the cb.
    return new Promise((resolve, reject) => {
        // we still use Callback API of moveCursor but with Promise maner
        process.stdout.moveCursor(dx, dy, () => {
            // just resolves inside the cb.
            resolve();
        });
    });
};

// ID placeholder for the id Server will asigne to the socket.
let id;

// Socket.
// Create and Return Socket
// createConnection creates and returns socket. a duplex stream where we can read and write.
const socket = net.createConnection({ host: HOST, port: PORT }, async () => {
    // ask client 'Enter a message > '
    const ask = async () => {
        // ask question with stdout. get reponse stdin.
        const msg = await rl.question('Enter a message > ');

        // move the cursor one line up
        await moveCursor(0, -1);

        // clear the entire line
        await clearLine(0);

        // send request with header:id and with data:msg.
        socket.write(`${id}-message-${msg}`);
    };

    // First ask
    ask();

    // when server writes response client side is reading here.
    socket.on('data', async (response) => {
        // log an empty line which will be cleared.
        console.log();

        // move cursor one lin up.
        await moveCursor(0, -1);

        // clear the entire line where cursor is.
        await clearLine(0);

        // decode the buffer in utf-8 format
        response = response.toString('utf-8');

        if (response.startsWith('id-')) {
            // when we are getting the ID;

            // get the id and asign.
            id = response.substring(3);

            console.log(`Your id is ${id}\n`);
        } else {
            // when we are fgetting just a msg.

            // Add new msg in the terminal
            console.log(response);
        }
        // Ask everytime someone in the chat writes something
        ask();
    });
});

socket.on('error', () => {
    console.log('Error!')
})

socket.on('close', () => {
    console.log('closed')
})

socket.on('end', () => {
    console.log('Connection was end! Probebly Server is down.');
});
