/**
 * Asset Preloader for War Commander
 * 
 * This script preloads all embedded assets into the OpenFL/Lime asset cache
 * before the game initializes. This is necessary because the game expects
 * some assets to be available synchronously, but loading from disk is async.
 */

(function () {
    'use strict';

    // List of critical embedded assets that need to be preloaded
    // These are assets that the game tries to load synchronously
    const EMBEDDED_ASSETS = [
        "assets/embedded/ui/map_fog.png",
        "assets/embedded/ui/selection/move_confirm.png",
        "assets/embedded/ui/selection/attackmove_confirm.png",
        "assets/embedded/worldmap/hex.png",
        "assets/embedded/worldmap/hex_player.png",
        "assets/embedded/worldmap/hex_red.png",
        "assets/embedded/worldmap/hex_green.png",
        "assets/embedded/worldmap/hex_black.png",
        "assets/embedded/worldmap/hex_orange.png",
        "assets/embedded/worldmap/entities/v2/cc_14.png",
        "assets/embedded/worldmap/entities/v2/cc_12.png",
        "assets/embedded/worldmap/entities/v2/rf_base_1.png",
        "assets/embedded/worldmap/entities/v2/rf_base_2.png",
        "assets/embedded/terrain/default.png",
        "assets/embedded/terrain/terrain10.png",
        "assets/images/terrain.png",
        "assets/images/base_pad.png",
        "assets/images/cc_04.png",
        "assets/images/cursor.png",
        "assets/images/selection.png"
    ];

    // List of critical text assets
    const TEXT_ASSETS = [
        "lang/en.json",
        "assets/lang/en.json",
        "lang/en_US.json",
        "assets/lang/en_US.json",
        "lang/en_real.json",
        "assets/lang/en_real.json",
        "lang/en_US_real.json",
        "assets/lang/en_US_real.json"
    ];

    // List of heavy binary assets to parallel prefetch
    const BINARY_ASSETS = [
        "lib/bufficons.zip",
        "lib/Alliance_Manager_Popup.zip",
        "lib/boost_icons.zip",
        "lib/Boosts_Popup.zip",
        "lib/Loot_Chest_Popup.zip",
        "lib/all.zip",
        "lib/ChatUI.zip"
    ];

    // Base64 placeholders for missing assets
    const PLACEHOLDERS = {
        "hex": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAALUlEQVRYR+3QQREAAAgEMdw/ot7WAAuY5Cdpqi7T99sBAgQIECBAgAABAgQIEDgDWQDO0/203YAAAAAASUVORK5CYII=", // Grey 32x32
        "base": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAALUlEQVRYR+3QQREAAAgEMdw/ot7WAAuY5Cdpuq7T99sBAgQIECBAgAABAgQIEHgD2QBw5y6bAAAAAElFTkSuQmCC", // Red 32x32
        "terrain": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAALUlEQVRYR+3QQREAAAgEMdw/ot7WAAuY5Cdpuq7T99sBAgQIECBAgAABAgQIEHgD2QBw5y6bAAAAAElFTkSuQmCC" // Green-ish
    };

    // Track loading progress
    let loadedCount = 0;
    let totalCount = EMBEDDED_ASSETS.length + TEXT_ASSETS.length + BINARY_ASSETS.length;
    let loadedImages = new Map();
    let loadedText = new Map();

    /**
     * Preload a single image
     */
    function preloadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();

            // Check if we should force a placeholder
            var usePlaceholder = false;
            var placeholderData = null;

            if (src.indexOf("hex") !== -1 || src.indexOf("fog") !== -1) {
                placeholderData = PLACEHOLDERS.hex;
                usePlaceholder = true;
            }
            else if (src.indexOf("terrain") !== -1) {
                placeholderData = PLACEHOLDERS.terrain;
                usePlaceholder = true;
            }
            else if (src.indexOf("cc_") !== -1 || src.indexOf("rf_base") !== -1 || src.indexOf("base_pad") !== -1) {
                placeholderData = PLACEHOLDERS.base;
                usePlaceholder = true;
            }

            img.onload = () => {
                // console.log(`[LOG] Preloaded (${loadedImages.size + 1}/${EMBEDDED_ASSETS.length}): ${src} ` + (img.src.startsWith("data:") ? "(MOCK)" : "(REAL)"));
                loadedImages.set(src, img);
                loadedCount++;
                resolve(img);
            };

            img.onerror = () => {
                console.warn(`[WARN] Failed to preload: ${src}. Using Fallback.`);
                // If real load failed, fallback to placeholder
                if (!img.src.startsWith("data:")) {
                    img.src = PLACEHOLDERS.hex; // Generic fallback
                    // Prevent infinite loop
                    img.onerror = () => { resolve(null); };
                } else {
                    resolve(null);
                }
            };

            // Start load
            if (usePlaceholder) {
                // console.log(`[LOG] Serving placeholder for: ${src}`);
                img.src = placeholderData;
            } else {
                img.src = src;
            }
        });
    }

    /**
     * Preload a single text file
     */
    function preloadText(src) {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', src, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        loadedText.set(src, xhr.responseText);
                        loadedCount++;
                        console.log(`[LOG] Preloaded text: ${src}`);
                        resolve(xhr.responseText);
                    } else {
                        console.warn(`[WARN] Failed to preload text: ${src}`);
                        resolve(null);
                    }
                }
            };
            xhr.onerror = function () {
                console.warn(`[WARN] Error preloading text: ${src}`);
                resolve(null);
            };
            xhr.send();
        });
    }

    /**
     * Preload a binary file (ZIP) using fetch
     */
    function preloadBinary(src) {
        return fetch(src).then(r => {
            if (r.ok) {
                console.log(`[LOG] Preloaded binary: ${src}`);
                loadedCount++;
                return r.blob(); // Consume body to ensure download completes
            } else {
                console.warn(`[WARN] Failed to preload binary: ${src} (${r.status})`);
                return null;
            }
        }).catch(e => {
            console.warn(`[WARN] Error preloading binary: ${src}`, e);
            return null;
        });
    }

    /**
     * Preload all embedded assets
     */
    async function preloadAllAssets() {
        console.log(`Preloading ${totalCount} assets (${EMBEDDED_ASSETS.length} images, ${TEXT_ASSETS.length} text, ${BINARY_ASSETS.length} misc)...`);

        const imagePromises = EMBEDDED_ASSETS.map(src => preloadImage(src));
        const textPromises = TEXT_ASSETS.map(src => preloadText(src));
        const binaryPromises = BINARY_ASSETS.map(src => preloadBinary(src));

        await Promise.all([...imagePromises, ...textPromises, ...binaryPromises]);

        console.log(`Preloading complete. ${loadedImages.size} images and ${loadedText.size} text files loaded.`);
        return { images: loadedImages, text: loadedText };
    }

    function injectIntoCache() {
        console.log("[AssetPreloader] Attempting to inject into cache...");

        // Find the Assets class
        const Assets = (window.lime && window.lime.utils && window.lime.utils.Assets) ||
            (window._hx_classes && window._hx_classes['lime.utils.Assets']);

        if (!Assets) {
            console.warn("[AssetPreloader] Assets class not found yet. Retrying in 500ms...");
            setTimeout(injectIntoCache, 500);
            return;
        }

        // Initialize cache if missing
        if (!Assets.cache) {
            console.log("[AssetPreloader] Initializing Assets.cache...");
            Assets.cache = {};
        }

        if (!Assets.cache.image) Assets.cache.image = { h: {} };
        if (!Assets.cache.image.h) Assets.cache.image.h = {};

        if (!Assets.cache.text) Assets.cache.text = { h: {} };
        if (!Assets.cache.text.h) Assets.cache.text.h = {};

        // Inject Images
        let imgCount = 0;
        loadedImages.forEach((img, src) => {
            if (img && img.complete) {
                const limeImg = convertToLimeImage(img);
                const keys = [src, src.replace("assets/", ""), "default:" + src, "default:" + src.replace("assets/", "")];
                keys.forEach(k => { Assets.cache.image.h[k] = limeImg; });
                imgCount++;
            }
        });

        // Inject Text
        let txtCount = 0;
        loadedText.forEach((content, src) => {
            const keys = [src, src.replace("assets/", ""), "default:" + src, "default:" + src.replace("assets/", "")];
            if (src.endsWith(".json")) {
                const filename = src.split('/').pop();
                keys.push(filename, "default:" + filename);
            }
            keys.forEach(k => {
                if (!Assets.cache.text.h[k]) {
                    Assets.cache.text.h[k] = content;
                }
            });
            txtCount++;
        });

        console.log(`[AssetPreloader] Successfully injected ${imgCount} images and ${txtCount} text files.`);
    }

    /**
     * Convert a DOM Image to a Lime Image object
     */
    function convertToLimeImage(domImg) {
        // Create canvas to extract image data
        const canvas = document.createElement('canvas');
        canvas.width = domImg.width;
        canvas.height = domImg.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(domImg, 0, 0);

        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Create a Lime-compatible Image object
        const limeImage = {
            width: domImg.width,
            height: domImg.height,
            rect: { x: 0, y: 0, width: domImg.width, height: domImg.height },
            buffer: {
                data: imageData.data,
                width: domImg.width,
                height: domImg.height
            },
            __class__: 'lime.graphics.Image'
        };

        return limeImage;
    }

    // Export the preloader
    window.AssetPreloader = {
        preloadAllAssets: preloadAllAssets,
        injectIntoCache: injectIntoCache,
        getLoadedImages: () => loadedImages,
        getLoadedText: () => loadedText
    };

    // Auto-start preloading immediately
    preloadAllAssets().then(() => {
        window.__ASSETS_READY__ = true;
        console.log("AssetPreloader: All assets ready.");
    });

})();
