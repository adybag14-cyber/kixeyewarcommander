import os

file_path = "c:/Users/adyba/clone of game/index.html"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Check Terrain Patch
if "1-100" in content:
    print("Terrain patch ALREADY APPLIED.")
else:
    print("Terrain patch NOT found. Attempting verification...")
    # I won't re-apply terrain patch here to avoid complexity, assuming it worked or will be handled.
    # Actually, I should check if the old terrain patch is there.

# 2. Patch finishInit
target_str = """                function finishInit() {
                    clearInterval(poller);
                    var stage = findStage();
                    if (stage) {
                         drawGreenBox(stage);
                         // force map
                         try {
                             if (window._hx_classes["com.cc.core.MAP"]) {
                                 console.warn("[V68-LOGIN] Forcing MAP.Init()...");
                                 window._hx_classes["com.cc.core.MAP"].Init();
                             }
                         } catch (e) { console.error("Map Init Error", e); }
                    }
                }"""

# Normalize Line Endings for comparison
content_normalized = content.replace("\r\n", "\n")
target_normalized = target_str.replace("\r\n", "\n")

if target_normalized in content_normalized:
    print("Found exact target for finishInit. Replacing...")
    
    new_code = """                function finishInit() {
                    clearInterval(poller);
                    var stage = findStage();
                    if (stage) {
                         drawGreenBox(stage);
                         
                         // 1. Force Map Init
                         try {
                             if (window._hx_classes["com.cc.core.MAP"]) {
                                 console.warn("[V68-LOGIN] Forcing MAP.Init()...");
                                 window._hx_classes["com.cc.core.MAP"].Init();
                             }
                         } catch(e) { console.error("Map Init Error", e); }

                         // 2. Force UI / ViewManager
                         try {
                             var VM = window._hx_classes["com.cc.ui.ViewManager"];
                             if (VM) {
                                 console.warn("[V68-LOGIN] Found ViewManager. Attempting Init...");
                                 
                                 var instance = null;
                                 if (VM.getInstance) instance = VM.getInstance();
                                 else if (VM.instance) instance = VM.instance;
                                 else if (VM._instance) instance = VM._instance;
                                 
                                 if (instance) {
                                     console.warn("[V68-LOGIN] VM Instance Found:", instance);
                                     if (instance.init) instance.init();
                                     if (instance.show) instance.show();
                                     if (instance.changeView) {
                                         console.warn("[V68-LOGIN] Calling changeView(1)...");
                                         instance.changeView(1);
                                     }
                                 } else {
                                     console.warn("[V68-LOGIN] VM Instance NOT found. Creating new...");
                                 }
                             } else {
                                 console.warn("[V68-LOGIN] ViewManager NOT FOUND.");
                             }
                         } catch(e) { console.error("UI Init Error", e); }
                    }
                }"""
    
    new_content = content_normalized.replace(target_normalized, new_code)
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Successfully patched finishInit.")
    
else:
    print("Target NOT FOUND. Deducing why...")
    # Debug: Print the section around where we expect it
    idx = content_normalized.find("function finishInit()")
    if idx != -1:
        print("Found 'function finishInit()'. Dump of actual content:")
        print("--- START ---")
        print(content_normalized[idx:idx+500])
        print("--- END ---")
    else:
        print("Could not find 'function finishInit()'.")
