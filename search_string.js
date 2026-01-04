const fs = require('fs');
const content = fs.readFileSync('js/warcommander.patched.js', 'utf8');
const searchTerms = ['S9 =', 'formatCDNAssetNameIntoCacheingStrategyNamespace =', 'ab.', 'retrieveAssetByName'];
let index = -1;

for (const term of searchTerms) {
    index = content.indexOf(term);
    if (index !== -1) {
        console.log(`Found term: "${term}" at index ${index}`);
        break;
    }
}

if (index !== -1) {
    fs.writeFileSync('debug_context.txt', content.substring(index, index + 5000));
    console.log('Written to debug_context.txt');
} else {
    // Fallback
    console.log('Not found');
}
