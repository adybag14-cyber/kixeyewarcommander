export class AssetLoader {
    constructor() {
        this.assets = {};
        this.toLoad = [
            { name: 'terrain', src: 'assets/images/terrain.png' },
            { name: 'cc', src: 'assets/images/cc_04.png' },
            { name: 'tank', src: 'assets/images/tank.png' },
            { name: 'cursor', src: 'assets/images/cursor.png' },
            { name: 'selection', src: 'assets/images/selection.png' }
        ];
    }

    async loadAll() {
        // 1. Fetch the manifest
        try {
            const response = await fetch('assets/local_manifest.json');
            const fileList = await response.json();

            // 2. Load all assets in the list
            const promises = fileList.map(itemPath => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.src = itemPath;

                    // Key generation: Use the filename without extension as the key
                    // e.g. "assets/embedded/terrain/terrain45.png" -> "terrain45"
                    const filename = itemPath.split('/').pop().split('.')[0];

                    img.onload = () => {
                        this.assets[filename] = img;
                        resolve();
                    };
                    img.onerror = () => {
                        console.warn(`Failed to load asset: ${itemPath}`);
                        resolve(); // Resolve anyway to proceed
                    };
                });
            });

            await Promise.all(promises);
            console.log(`Loaded ${Object.keys(this.assets).length} assets.`);

        } catch (e) {
            console.error("Failed to load asset manifest:", e);
            // Fallback for manual loading if manifest fails
            await this.loadManualFallback();
        }
    }

    async loadManualFallback() {
        const fallback = [
            { name: 'terrain', src: 'assets/images/terrain.png' },
            { name: 'cc', src: 'assets/images/cc_04.png' },
            { name: 'tank', src: 'assets/images/tank.png' },
            { name: 'cursor', src: 'assets/images/cursor.png' },
            { name: 'selection', src: 'assets/images/selection.png' }
        ];
        // ... (manual loading logic similar to before)
    }

    get(name) {
        return this.assets[name];
    }
}
