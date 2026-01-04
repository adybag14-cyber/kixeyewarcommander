const fs = require('fs');
const lines = fs.readFileSync('js/warcommander.patched.js', 'utf8').split('\n');

console.log('Searching in ' + lines.length + ' lines...');

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // P = function or var P = function
    if (line.match(/var P\s*=\s*function/) || line.match(/[^a-zA-Z0-9]P\s*=\s*function/)) {
        console.log(`Possible P definition at line ${i + 1}`);
        console.log(`Context: ${line.substring(0, 100)}...`);
    }

    // requestFlags definition
    if (line.includes('requestFlags') && line.includes('function')) {
        console.log(`Found requestFlags at line ${i + 1}`);
        const contextEnd = Math.min(line.length, 200);
        console.log(`Context: ${line.substring(0, contextEnd)}...`);

        // Check for class name in this line or previous
        if (line.includes('l["')) {
            const matches = line.match(/l\["(.*?)"\]/g);
            if (matches) console.log('Classes defined here:', matches.join(', '));
        }
    }

    // l["..."] = P
    if (line.includes('] = P;')) {
        console.log(`Found assignment to P at line ${i + 1}: ${line.substring(0, 100)}`);
    }
}
