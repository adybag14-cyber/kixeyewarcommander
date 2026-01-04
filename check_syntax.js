const vm = require('vm');
const fs = require('fs');
const code = fs.readFileSync('js/warcommander.patched.js', 'utf8');
try {
    new vm.Script(code, { filename: 'warcommander.patched.js' });
    console.log("Syntax OK");
} catch (e) {
    console.error(e.stack);
}
