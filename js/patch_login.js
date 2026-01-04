(function () {
    console.error("[V68-LOGIN] POLLER STARTED!!! (Aggressive Mode)");
    var maxAttempts = 1000; // 10 seconds
    var attempts = 0;

    // Immediate Check
    checkLogin();

    var poller = setInterval(function () {
        attempts++;
        if (attempts > maxAttempts) {
            console.error("[V68-LOGIN] Poller TIMEOUT.");
            clearInterval(poller);
            return;
        }
        checkLogin();
    }, 10);

    function checkLogin() {
        try {
            if (window._hx_classes) {
                // Check "ja.Login"
                var Login = window._hx_classes["ja.Login"];
                if (Login && Login.prototype && Login.prototype.handleLoadError) {
                    if (!Login.prototype.handleLoadError.patched) {
                        console.error("[V68-LOGIN] FOUND ja.Login! PATCHING NOW!");
                        Login.prototype.handleLoadError = function (e) {
                            console.error("[V68-LOGIN] SUPPRESSED FATAL ERROR (Poller):", e);
                            if (this.handleLoadSuccess) {
                                console.error("[V68-LOGIN] Calling handleLoadSuccess(null)");
                                this.handleLoadSuccess(null);
                            } else {
                                console.error("[V68-LOGIN] handleLoadSuccess MISSING!");
                            }
                        };
                        Login.prototype.handleLoadError.patched = true;

                        // Also patch handleLoadSuccess to log
                        var originalSuccess = Login.prototype.handleLoadSuccess;
                        Login.prototype.handleLoadSuccess = function (data) {
                            console.error("[V68-LOGIN] handleLoadSuccess CALLED!", data);
                            originalSuccess.call(this, data);
                        };
                    }
                    // Keep polling just in case? No, clear it.
                    clearInterval(poller);
                    return;
                }
            }
        } catch (e) { console.error("[V68-LOGIN] POLLER ERROR", e); }
    }
})();
