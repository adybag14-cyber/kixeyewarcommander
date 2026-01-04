import re

file_path = "c:/Users/adyba/clone of game/index.html"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# ------------------------------------------------------------------
# 14. DEBUG TEXTURE CAPTURE
# ------------------------------------------------------------------
# The previous logic relied on `source.image` or `source.canvas`.
# Maybe OpenFL BitmapData structure is different in this build.
# We will update V68_patchTexture to be more aggressive in logging keys.

pattern_tex_patch = r"window\.V68_patchTexture = function\(val\) \{[\s\S]*?\}\s*;"

new_tex_patch = r"""window.V68_patchTexture = function(val) {
                if (val && val.prototype && val.prototype.uploadFromBitmapData && !val.prototype.uploadFromBitmapData.patched) {
                    console.warn("[V68-GPU] Patching Texture.uploadFromBitmapData...");
                    var origUpload = val.prototype.uploadFromBitmapData;
                    val.prototype.uploadFromBitmapData = function(source, miplevel) {
                        try {
                            if (source && !window.V68_LOGGED_TEX_KEYS) {
                                // Log keys of the FIRST source object to understand structure
                                console.warn("[V68-GPU] Inspecting BitmapData Source:", source);
                                try {
                                    var keys = [];
                                    for (var k in source) keys.push(k);
                                    console.warn("[V68-GPU] Source Keys:", keys);
                                    
                                    // Check common openfl props
                                    console.warn("[V68-GPU] .image:", source.image, " .canvas:", source.canvas, " .__texture:", source.__texture);
                                    if (source.get_image) console.warn("[V68-GPU] get_image():", source.get_image());
                                } catch(e) { console.warn("Key inspect error", e); }
                                window.V68_LOGGED_TEX_KEYS = true;
                            }

                            if (source) {
                                var imgSrc = null;
                                if (source.image && source.image.src) imgSrc = source.image.src;
                                else if (source.canvas && source.canvas.toDataURL) imgSrc = source.canvas.toDataURL();
                                else if (source.__image && source.__image.src) imgSrc = source.__image.src;
                                else if (source.__canvas && source.__canvas.toDataURL) imgSrc = source.__canvas.toDataURL();
                                // Direct Image element?
                                else if (source.src) imgSrc = source.src;
                                
                                if (imgSrc) {
                                    // Avoid duplicates?? No, keep everything for now.
                                    var meta = {
                                        w: source.width, h: source.height, 
                                        src: imgSrc,
                                        len: imgSrc.length,
                                        timestamp: new Date().getTime()
                                    };
                                    window.V68_TEXTURES.push(meta);
                                    // console.warn("[V68-GPU] Captured Texture ("+meta.w+"x"+meta.h+")");
                                    if(window.V68_updateSniffer) window.V68_updateSniffer();
                                }
                            }
                        } catch(e) { console.error("[V68-GPU] Rip Error", e); }
                        return origUpload.apply(this, arguments);
                    };
                    val.prototype.uploadFromBitmapData.patched = true;
                }
            };"""

if "window.V68_LOGGED_TEX_KEYS" not in content:
    content, c15 = re.subn(pattern_tex_patch, new_tex_patch, content)
    print(f"Updated V68_patchTexture with Deep Inspection: {c15}")
else:
    print("Texture Patch already has deep inspection.")
    
with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("SUCCESS: File updated.")
