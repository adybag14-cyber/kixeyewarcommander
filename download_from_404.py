#!/usr/bin/env python3
"""
Script to parse 404 errors from console log and download missing assets.
Uses 32 threads for maximum performance.
"""

import re
import subprocess
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
from urllib.parse import unquote

BASE_DIR = Path(r"c:\Users\adyba\clone of game")
CDN_BASE = "https://wc-origin.cdn-kixeye.com/game/game-v7.v71601"
OUTPUT_DIR = BASE_DIR / "assets"
CONSOLE_LOG = BASE_DIR / "console_log.md"

# Known asset folder mappings based on file names
ASSET_FOLDERS = {
    # Selection assets
    "selection_": "embedded/ui/selection/",
    "movement_selection": "embedded/ui/selection/",
    "enemy_selection": "embedded/ui/selection/",
    "enemy_air_selection": "embedded/ui/selection/",
    "rubi_selection": "embedded/ui/selection/",
    "move_confirmation": "embedded/ui/selection/",
    "attack_confirmation": "embedded/ui/selection/",
    "stand_ground": "embedded/ui/selection/",
    
    # Scroller
    "body_blue": "embedded/ui/scroller/",
    "body_red": "embedded/ui/scroller/",
    "body_green": "embedded/ui/scroller/",
    "top_blue": "embedded/ui/scroller/",
    "top_red": "embedded/ui/scroller/",
    "top_green": "embedded/ui/scroller/",
    "notches_blue": "embedded/ui/scroller/",
    "notches_red": "embedded/ui/scroller/",
    "notches_green": "embedded/ui/scroller/",
    
    # Field bonuses
    "BW_Backer": "embedded/ui/field_bonuses/",
    "UnitNameBacker": "embedded/ui/field_bonuses/",
    "Radial_Gradient": "embedded/ui/field_bonuses/",
    "Button.png": "embedded/ui/field_bonuses/",
    "Button_Disabled": "embedded/ui/field_bonuses/",
    "Icon.png": "embedded/ui/field_bonuses/",
    "Icon_Disabled": "embedded/ui/field_bonuses/",
    
    # Currency icons  
    "icon_gold": "embedded/ui/currencyicons/",
    "icon_thorium": "embedded/ui/currencyicons/",
    "icon_iridium": "embedded/ui/currencyicons/",
    "icon_cores": "embedded/ui/currencyicons/",
    "icon_chemicals": "embedded/ui/currencyicons/",
    "icon_silicon": "embedded/ui/currencyicons/",
    "icon_medals": "embedded/ui/currencyicons/",
    "icon_time": "embedded/ui/currencyicons/",
    "icon_eventxp": "embedded/ui/currencyicons/",
    "icon_event_tokens": "embedded/ui/currencyicons/",
    "icon_blood_thorium": "embedded/ui/currencyicons/",
    "icon_retaliation_xp": "embedded/ui/currencyicons/",
    "icon_sector_breach_xp": "embedded/ui/currencyicons/",
    "icon_holdout_xp": "embedded/ui/currencyicons/",
    "icon_skirmish_xp": "embedded/ui/currencyicons/",
    "icon_currency_war_efforts": "embedded/ui/currencyicons/",
    "icon_retalliation": "embedded/ui/currencyicons/",
    "icon_event_supplydepot_token": "embedded/ui/currencyicons/",
    "icon_kixmas_token": "embedded/ui/currencyicons/",
    "icon_gen_ii_parts": "embedded/ui/currencyicons/",
    
    # Building icons
    "icon_full": "embedded/ui/buildingicons/",
    "icon_power": "embedded/ui/buildingicons/",
    "icon_ready": "embedded/ui/buildingicons/",
    "icon_promotion": "embedded/ui/buildingicons/",
    "icon_halt": "embedded/ui/buildingicons/",
    "icon_overdrive": "embedded/ui/buildingicons/",
    "icon_ammo": "embedded/ui/buildingicons/",
    "level-stars": "embedded/ui/buildingicons/",
    
    # PvP / Infamy
    "honor_small": "embedded/ui/pvp/",
    "medal_small": "embedded/ui/infamy/",
    
    # Worldmap rollover  
    "roll_bottom": "embedded/ui/worldmap/rollover/",
    "spotlight": "embedded/ui/worldmap/rollover/",
    "icn_": "embedded/ui/worldmap/rollover/",
    "bookmark_map": "embedded/ui/worldmap/rollover/",
    "pvp_platoon": "embedded/ui/worldmap/rollover/",
    "assault_platoon": "embedded/ui/worldmap/rollover/",
    "selected_": "embedded/ui/worldmap/rollover/",
    
    # Gold store
    "Deals_Background": "embedded/ui/goldstore/dailydeals/",
    "Arrow_Button": "embedded/ui/goldstore/dailydeals/",
    "Sale_Gradient": "embedded/ui/goldstore/",
    "Label_Recommended": "embedded/ui/goldstore/",
    "Label_LastChance": "embedded/ui/goldstore/",
    "Label_New": "embedded/ui/goldstore/",
    "Item_Gradient": "embedded/ui/goldstore/",
    "Currency_Backer": "embedded/ui/goldstore/",
    "MissingIcon": "embedded/ui/goldstore/",
    "50px_Store": "embedded/ui/goldstore/storepages/",
    
    # Gold store frames
    "Header_Left": "embedded/ui/goldstore/frames/popup/",
    "Header_Middle": "embedded/ui/goldstore/frames/popup/",
    "Header_Right": "embedded/ui/goldstore/frames/popup/",
    "Frame_Corner": "embedded/ui/goldstore/frames/popup/",
    "Frame_Top_Fill": "embedded/ui/goldstore/frames/popup/",
    "Frame_Bottom_Fill": "embedded/ui/goldstore/frames/popup/",
    "Frame_Left_Fill": "embedded/ui/goldstore/frames/popup/",
    "Frame_Right_Fill": "embedded/ui/goldstore/frames/popup/",
    "Menu_Backer": "embedded/ui/goldstore/frames/popup/",
    "Panel_Fill": "embedded/ui/goldstore/frames/popup/",
    "Panel_Top": "embedded/ui/goldstore/frames/popup/",
    "Panel_Bottom": "embedded/ui/goldstore/frames/popup/",
    
    # Widgets
    "scanline_pattern": "embedded/ui/widgets/",
    "grid_pattern": "embedded/ui/widgets/",
    "resthorium": "embedded/ui/widgets/",
    
    # Factions (numbered icons)
    ".png": "embedded/ui/widgets/factions/icons/",  # fallback for numbered files
}

def parse_404_files():
    """Parse console log to find 404 file names."""
    content = CONSOLE_LOG.read_text(encoding='utf-8', errors='ignore')
    
    # Pattern to match "filename.png:1  Failed to load resource"
    pattern = re.compile(r'^([^\s:]+\.png):1\s+Failed to load resource', re.MULTILINE)
    
    files = set()
    for match in pattern.findall(content):
        # URL decode
        filename = unquote(match)
        files.add(filename)
    
    return sorted(files)

def guess_asset_path(filename):
    """Try to guess the full asset path based on filename patterns."""
    for pattern, folder in ASSET_FOLDERS.items():
        if pattern in filename:
            return folder + filename
    
    # Default: try common folders
    return None

def download_asset(asset_path):
    """Download a single asset from the CDN."""
    url = f"{CDN_BASE}/{asset_path}"
    output_path = OUTPUT_DIR / asset_path
    
    # Create directory if needed
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    # Skip if already exists and has content
    if output_path.exists() and output_path.stat().st_size > 100:
        return f"SKIP: {asset_path}"
    
    try:
        result = subprocess.run(
            ["curl", "-s", "-o", str(output_path), "-w", "%{http_code}", url],
            capture_output=True,
            text=True,
            timeout=30
        )
        http_code = result.stdout.strip()
        
        if http_code == "200":
            return f"OK: {asset_path}"
        else:
            # Delete failed file
            if output_path.exists():
                output_path.unlink()
            return f"FAIL ({http_code}): {asset_path}"
    except Exception as e:
        return f"ERROR: {asset_path} - {e}"

def main():
    print("Parsing 404 errors from console log...")
    files = parse_404_files()
    print(f"Found {len(files)} unique 404 file names")
    
    # Try to guess paths for each file
    paths_to_download = []
    unknown_files = []
    
    for filename in files:
        path = guess_asset_path(filename)
        if path:
            paths_to_download.append(path)
        else:
            unknown_files.append(filename)
    
    print(f"Mapped {len(paths_to_download)} files to paths")
    if unknown_files:
        print(f"Could not map {len(unknown_files)} files: {unknown_files[:10]}...")
    
    print(f"\nDownloading assets with 32 threads...")
    results = {"ok": 0, "skip": 0, "fail": 0, "error": 0}
    
    with ThreadPoolExecutor(max_workers=32) as executor:
        futures = {executor.submit(download_asset, path): path for path in paths_to_download}
        
        for future in as_completed(futures):
            result = future.result()
            print(result)
            
            if result.startswith("OK"):
                results["ok"] += 1
            elif result.startswith("SKIP"):
                results["skip"] += 1
            elif result.startswith("FAIL"):
                results["fail"] += 1
            else:
                results["error"] += 1
    
    print(f"\n=== Summary ===")
    print(f"Downloaded: {results['ok']}")
    print(f"Skipped (already exist): {results['skip']}")
    print(f"Failed: {results['fail']}")
    print(f"Errors: {results['error']}")

if __name__ == "__main__":
    main()
