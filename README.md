# Kixeye War Commander Clone & Toolset

A comprehensive collection of tools, scripts, and patches for analyzing, debugging, and running the Kixeye War Commander game environment locally.

## 🚀 Overview

This repository contains the reconstructed infrastructure and patching logic required to serve and run War Commander. It includes a custom Python server, JavaScript runtime patches, and various utility scripts for asset management and syntax debugging.

## 📂 Key Components

### 🖥️ Server Infrastructure
- **`server.py`**: The primary backend logic that mocks Kixeye's gateway. It handles:
  - `getflags` and `setflags` requests.
  - `loadidata` for game configuration.
  - Asset routing for SWF, JS, and JSON data.
- **`server.js`**: A Node.js alternative for serving certain game components.
- **`index.html`**: The main entry point for the game client.

### 🛠️ Patching & Debugging
- **`js/patch_game_init_v31.js`**: Critical runtime patches that hook into the game's initialization sequence to bypass auth or inject mock data.
- **`js/game.js` / `v68_debug.js`**: Patched versions of the main game engine.
- **`try_relocate.js`**: Logic for relocating assets to local paths.

### 🐍 Helper Scripts
- **`download_assets.py` / `bulk_download.py`**: Tools for fetching game assets from remote CDNs.
- **`check_syntax.py` / `bisect_syntax.py`**: Specialized tools for fixing syntax errors in large, obfuscated JavaScript files.
- **`create_placeholders.py`**: Generates missing assets to prevent 404 errors during initialization.

## 🛠️ Getting Started

1. **Install Dependencies**:
   Ensure you have Python 3.x and Node.js installed.
   ```bash
   pip install -r requirements.txt (if applicable)
   ```

2. **Run the Server**:
   Launch the mock gateway:
   ```bash
   python server.py
   ```

3. **Open the Game**:
   Navigate to `http://localhost:8000` (or the port specified in `server.py`) in your browser.

## 📜 License

This project is licensed under the **MIT License**. 

**You are free to:**
- ✅ **Use** the code for any purpose.
- ✅ **Distribute** the code.
- ✅ **Modify** and create derivatives.
- ✅ **Sell** the software or services based on it.

See the [LICENSE](LICENSE) file for the full text.

## ⚠️ Disclaimer
This toolset is for educational and research purposes. Use responsibly.
