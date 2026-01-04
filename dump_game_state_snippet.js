(function () {
    var output = [];
    output.push("=== RUNTIME STATE DUMP ===");
    output.push("Timestamp: " + new Date().toISOString());

    // 1. Check Assertions in Logs (Simulated by checking current state if possible, or just dump what we can)
    // We can't access past logs easily without a proxy, but we can verify our patches presence.
    try {
        if (window.GLOBAL && window.GLOBAL.setServerTimestampSeconds) {
            output.push("GLOBAL.setServerTimestampSeconds present: YES");
            var src = window.GLOBAL.setServerTimestampSeconds.toString();
            output.push("Source snippet: " + src.substring(0, 100));
        } else {
            output.push("GLOBAL.setServerTimestampSeconds present: NO");
        }
    } catch (e) { output.push("Error checking GLOBAL: " + e); }

    // 2. Dump _hx_classes keys
    if (window._hx_classes) {
        var keys = Object.keys(window._hx_classes).sort();
        output.push("\n=== _hx_classes KEYS (" + keys.length + ") ===");
        output.push(keys.join("\n"));
    } else {
        output.push("\n=== _hx_classes NOT FOUND ===");
    }

    // 3. Dump lime.$scripts keys
    if (window.lime && window.lime.$scripts) {
        var keys = Object.keys(window.lime.$scripts).sort();
        output.push("\n=== lime.$scripts KEYS (" + keys.length + ") ===");
        output.push(keys.join("\n"));
    }

    // 4. Check Config
    if (window.wc_config) {
        output.push("\n=== wc_config ===");
        output.push(JSON.stringify(window.wc_config, null, 2));
    }

    return output.join("\n");
})();
