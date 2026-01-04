const fs = require('fs');
const path = 'shared_configs.json';

try {
    const data = JSON.parse(fs.readFileSync(path, 'utf8'));
    // Find manifest_config
    const manifestConfig = data.find(c => c.name === 'manifest_config');
    if (manifestConfig) {
        console.log('Found manifest_config.');
        const values = JSON.parse(manifestConfig.values);

        // Add buildings.json
        if (!values['buildings.json']) {
            values['buildings.json'] = "1";
            console.log('Added buildings.json to manifest.');
        } else {
            console.log('buildings.json already in manifest.');
        }

        // Save back
        manifestConfig.values = JSON.stringify(values);
        fs.writeFileSync(path, JSON.stringify(data, null, 4), 'utf8');
        console.log('Updated shared_configs.json successfully.');
    } else {
        console.error('manifest_config not found in shared_configs.json');
    }
} catch (e) {
    console.error('Error updating config:', e);
}
