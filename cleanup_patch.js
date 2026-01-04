const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'js', 'warcommander.patched.js');

try {
    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.split(/\r?\n/);

    // Verify key lines to ensure we are targeting the right block
    // Line 54753 is index 54752
    const startLineIndex = 54752;
    const endLineIndex = 54909; // Line 54910

    if (lines.length < 54915) {
        console.error("File is too short!");
        process.exit(1);
    }

    const startLine = lines[startLineIndex];
    if (!startLine.includes('(function () {')) {
        console.error("Start line mismatch at " + (startLineIndex + 1) + ": " + startLine);
        process.exit(1);
    }

    const checkLine = lines[startLineIndex + 1];
    if (!checkLine.includes('ANTIGRAVITY V68')) {
        console.error("Line " + (startLineIndex + 2) + " mismatch: " + checkLine);
        process.exit(1);
    }

    const endLine = lines[endLineIndex];
    if (!endLine.includes('})();')) {
        console.warning("End line mismatch at " + (endLineIndex + 1) + ": " + endLine);
        // Continue? The view showed it was })();
    }

    console.log("Removing lines " + (startLineIndex + 1) + " to " + (endLineIndex + 1));

    // Remove the block
    lines.splice(startLineIndex, (endLineIndex - startLineIndex + 1));

    const newData = lines.join('\n');
    fs.writeFileSync(filePath, newData);
    console.log("Successfully removed V68 debug block.");

} catch (e) {
    console.error("Error:", e);
    process.exit(1);
}
