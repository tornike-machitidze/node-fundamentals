// alloc()
// allocUnsafe()
// allocUnsafeSlow()

Buffer.alloc(1000, 'optional parrameter', 'utf8'); // only alloc can get fill information

Buffer.allocUnsafe(1000) // takes only size of buffer same for slow
// unsafe can fill itself with old data from memory