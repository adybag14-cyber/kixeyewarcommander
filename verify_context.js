const fs = require('fs');
const idx = 4694513;
const fd = fs.openSync('js/warcommander.patched.js', 'r');
const buf = Buffer.alloc(1000);
fs.readSync(fd, buf, 0, 1000, idx);
console.log(JSON.stringify(buf.toString('utf8')));
