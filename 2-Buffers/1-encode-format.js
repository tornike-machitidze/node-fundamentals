// encoding a string in base64 format

const encoding = (str) => {
  // encodes a string in base64 format
  const base64 = Buffer.from(str, 'utf-8').toString('base64');

  // encods a string in hex format
  const hex = Buffer.from(str, 'utf-8').toString('hex');

  return { base64, hex }
}

console.log(encoding('hello there'));

// {
//   base64: 'aGVsbG8gdGhlcmU=',
//   hex: '68656c6c6f207468657265'
// }