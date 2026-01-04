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

    // Base64 placeholders for missing assets
    const PLACEHOLDERS = {
        "hex": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAALUlEQVRYR+3QQREAAAgEMdw/ot7WAAuY5Cdpqi7T99sBAgQIECBAgAABAgQIEDgDWQDO0/203YAAAAAASUVORK5CYII=", // Grey 32x32
        "base": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAALUlEQVRYR+3QQREAAAgEMdw/ot7WAAuY5Cdpuq7T99sBAgQIECBAgAABAgQIEHgD2QBw5y6bAAAAAElFTkSuQmCC", // Red 32x32
        "terrain": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAALUlEQVRYR+3QQREAAAgEMdw/ot7WAAuY5Cdpuq7T99sBAgQIECBAgAABAgQIEHgD2QBw5y6bAAAAAElFTkSuQmCC" // Green-ish
    };

    // Track loading progress
    let loadedCount = 0;
    let totalCount = EMBEDDED_ASSETS.length + TEXT_ASSETS.length;
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
     * Preload all embedded assets
     */
    async function preloadAllAssets() {
        console.log(`Preloading ${totalCount} assets (${EMBEDDED_ASSETS.length} images, ${TEXT_ASSETS.length} text)...`);

        const imagePromises = EMBEDDED_ASSETS.map(src => preloadImage(src));
        const textPromises = TEXT_ASSETS.map(src => preloadText(src));

        await Promise.all([...imagePromises, ...textPromises]);

        console.log(`Preloading complete. ${loadedImages.size} images and ${loadedText.size} text files loaded.`);
        return { images: loadedImages, text: loadedText };
    }

    function injectIntoCache() {
        // The Lime asset cache is at lime.utils.Assets.cache or accessible via the library
        if (window._hx_classes && window._hx_classes['lime.utils.Assets']) {
            const Assets = window._hx_classes['lime.utils.Assets'];

            // Inject Images
            if (Assets.cache && Assets.cache.image) {
                console.log('Injecting preloaded assets into Lime cache...');

                loadedImages.forEach((img, src) => {
                    if (img && img.complete && img.width > 0) {
                        var limeImg = convertToLimeImage(img);

                        // Injection logic matching text injection closely
                        Assets.cache.image.h[src] = limeImg;
                        var shortKey = src.replace('assets/', '');
                        Assets.cache.image.h[shortKey] = limeImg;
                        Assets.cache.image.h['default:' + shortKey] = limeImg;
                        Assets.cache.image.h['default:' + src] = limeImg;
                    }
                });
                console.log(`Injected ${loadedImages.size} images into cache.`);
            }

            // Inject Text
            // Force cache initialization if completely missing
            if (!Assets.cache) {
                console.warn("[AssetPreloader] Assets.cache missing completely! Initializing...");
                Assets.cache = { text: { h: {} }, image: { h: {} } };
            } else if (!Assets.cache.text) {
                console.warn("[AssetPreloader] Assets.cache.text missing. Initializing new cache map.");
                Assets.cache.text = { h: {} };
            }

            if (Assets.cache && Assets.cache.text) {
                console.log('Injecting preloaded text into Lime cache...');
                loadedText.forEach((content, src) => {
                    if (content) {
                        // Extensive key variations to ensure detection
                        const variants = [
                            src,                              // e.g. assets/lang/en.json
                            src.replace("assets/", ""),       // e.g. lang/en.json
                            "assets/" + src,                  // e.g. assets/assets/lang/en.json (just in case)
                            "default:" + src,
                            "default:" + src.replace("assets/", "")
                        ];

                        // Also specifically target "en.json" since that's often the root key
                        if (src.endsWith("en.json")) {
                            variants.push("en.json");
                            variants.push("assets/en.json");
                            variants.push("default:en.json");
                        }

                        variants.forEach(key => {
                            Assets.cache.text.h[key] = content;
                        });

                        console.log(`Cached text: ${src} as ${variants.length} keys`);
                    }
                });
                console.log(`Injected ${loadedText.size} text files into cache.`);
            }
        } else {
            console.error("[AssetPreloader] lime.utils.Assets class NOT FOUND under window._hx_classes!");
        }
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
