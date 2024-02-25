const EventEmitter = require('events');
const fsPromisies = require('node:fs/promises');
const ee = new EventEmitter();

// Create file handler
const createFile = async (file) => {
    try {
        const existingFileHandle = await fsPromisies.open(file, 'r');
        await existingFileHandle.close();
        console.log('Error: can not create the file exists');
    } catch (error) {
        const newFileHandle = await fsPromisies.open(file, 'w');
        console.log('File was created successfully.');
        await newFileHandle.close();
    }
};

// Delete file handler
const deleteFile = async (file) => {
    try {
        const existingFileHandle = await fsPromisies.open(file, 'r');
        await existingFileHandle.close();
        await fsPromisies.rm(file);
        console.log('File was deleted successfully.');
    } catch (error) {
        console.log('Error: file does not exists');
    }
};

// Write content handler
const writeContent = async (file, content) => {
    try {
        const existingFileHandle = await fsPromisies.open(file, 'r+');
        await existingFileHandle.write(content);
        await existingFileHandle.close();

        console.log('Content was written successfully!');
    } catch (error) {
        console.log('Error: file does not exists!');
    }
};

// Append content handler
const appendContent = async (file, content) => {
    try {
        const existingFileHandle = await fsPromisies.open(file, 'a');
        await existingFileHandle.appendFile(content);
        await existingFileHandle.close();
        console.log('Content was appended successfully!');
    } catch (error) {
        console.log('Error: file does not exists');
    }
};

const watchCommandsFile = async () => {
    const asyncEventsGenerator = fsPromisies.watch('commands.txt');
    const commandsFileHandle = await fsPromisies.open('commands.txt', 'r');

    commandsFileHandle.on('change', async () => {
        const fileSize = (await commandsFileHandle.stat()).size;
        const buffer = Buffer.alloc(fileSize);

        const offset = 0;
        const length = buffer.byteLength;
        const position = 0;

        // read the file in buffer
        await commandsFileHandle.read(buffer, offset, length, position);

        // decode the buffer
        const content = buffer.toString('utf-8').split(' ');
        const command = content[0];
        const fileName = content[1];
        const text = content[2];

        switch (command) {
            case 'create':
                createFile(fileName);
                break;
            case 'delete':
                deleteFile(fileName);
                break;
            case 'write':
                writeContent(fileName, text);
                break;
            case 'append':
                appendContent(fileName, text);
                break;
            default:
                console.log('Command was not found');
                break;
        }
    });

    for await (let event of asyncEventsGenerator) {
        if (event.eventType === 'change') {
            commandsFileHandle.emit('change');
        }
    }
};

ee.once('runApp', watchCommandsFile).emit('runApp');
