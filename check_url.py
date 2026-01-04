import requests

candidates = [
    "https://wc-fb-canvas.kixeye.com/game/assets/ui/loading/loading.png",
    "https://wc-fb-canvas.kixeye.com/assets/ui/loading/loading.png",
    "https://wc-fb-canvas.kixeye.com/game/assets/assets/ui/loading/loading.png",
    "https://wc-fb.kixeye.com/game/assets/ui/loading/loading.png",
    "https://wc-fb.kixeye.com/assets/ui/loading/loading.png",
    "https://cdn.kixeye.com/wc/game/assets/ui/loading/loading.png",
    # Try a file that might be at root
    "https://wc-fb-canvas.kixeye.com/game/lang/en.json",
    "https://wc-fb-canvas.kixeye.com/lang/en.json"
]

print("Testing URLs...")
for url in candidates:
    try:
        r = requests.head(url, timeout=3)
        print(f"{r.status_code} {url}")
    except Exception as e:
        print(f"Error {url}: {e}")
