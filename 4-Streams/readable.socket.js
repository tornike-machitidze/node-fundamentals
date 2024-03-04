
Socket.prototype._read = function (n) {
  debug(
    '_read - n', n,
    'isConnecting?', !!this.connecting,
    'hasHandle?', !!this._handle,
  );

  if (this.connecting || !this._handle) {
    debug('_read wait for connection');
    this.once('connect', () => this._read(n));
  } else if (!this._handle.reading) {
    tryReadStart(this);
  }
};

function tryReadStart(socket) {
  // Not already reading, start the flow
  debug('Socket._handle.readStart');
  socket._handle.reading = true;
  const err = socket._handle.readStart();
  if (err)
    socket.destroy(errnoException(err, 'read'));
}