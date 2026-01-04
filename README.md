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

---

## 👨‍🏫 Amateur's Guide to Running the Clone

If you are new to this project, follow these steps to get the game running:

### 1. The Setup
- **Python**: Most logic for serving assets is in `server.py`. You need Python 3 installed.
- **Node.js**: Used for checking if your code has typos (syntax errors).

### 2. How to Start
1.  Open a terminal in this folder.
2.  Run `python server.py`. This starts your "Local Gateway".
3.  Open your browser and type `http://localhost:8089`.

### 3. "The Game is stuck on Loading"
This is common. The game is checking for assets that might not exist yet.
- Look at the terminal where `server.py` is running. If you see `404 Not Found` for a file like `assets/images/terrain.png`, it means that file is missing.
- You can run `python create_placeholders.py` to generate fake versions of missing images so the game continues.

### 4. Making yourself a "Pro"
- Open `server.py` and find `get_player_info_response`.
- Change `"level": 100` to whatever you want.
- Change `"name": "Commander"` to your own nickname.

## 🛠️ Advanced Troubleshooting

### Memory Hacking (Runtime Patching)
The file `js/patch_game_init_v31.js` is where the "magic" happens. If the game shows a "Connection Lost" popup, this script finds it in the computer's memory and deletes it so you can keep playing.

### Syntax Fixing
Large JavaScript files often get corrupted during extraction. 
- Use `python check_syntax.py` to find exactly where a file is "broken" (e.g., a missing `}` or `)`).

## ⚠️ Disclaimer
This toolset is for educational and research purposes. Use responsibly.
