const {Base64} = require('js-base64');

const name = "http://localhost:4000?title="

const encoded = Base64.encode(name);
console.log('Encoded=', encoded);

const decoded = Base64.decode(encoded);
console.log('Decoded=', decoded);