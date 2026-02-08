import requests

base_urls = [
    "https://wc-origin.cdn-kixeye.com/game/game-v7.v71601/",
    "https://wc-a.akamaihd.net/",
    "https://wc-a.akamaihd.net/assets/",
    "https://wc-a.akamaihd.net/game/",
    "https://wc-a.akamaihd.net/game/assets/",
    "https://wc-origin.cdn-kixeye.com/game/assets/"
]

path = "manifest/worldmap/entities/v2/units/Zombie_Catapult_Base.1.png"

for base in base_urls:
    url = base + path
    try:
        r = requests.head(url, timeout=3)
        print(f"{url}: {r.status_code}")
    except Exception as e:
        print(f"{url}: {e}")
