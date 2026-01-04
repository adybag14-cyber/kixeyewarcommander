import requests
import concurrent.futures

base_url = "https://wc-origin.cdn-kixeye.com/game/game-v7.v71601/embedded/terrain/terrain{}.png?169512"

def check_url(i):
    url = base_url.format(i)
    try:
        r = requests.head(url, timeout=2)
        if r.status_code == 200:
            return i, True
    except:
        pass
    return i, False

def main():
    print("Scanning terrain 0-200...")
    found = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=20) as executor:
        futures = {executor.submit(check_url, i): i for i in range(200)}
        for future in concurrent.futures.as_completed(futures):
            i, exists = future.result()
            if exists:
                found.append(i)
                print(f"Found: terrain{i}.png")
    
    found.sort()
    print(f"\nTotal Found: {len(found)}")
    print(f"Range: {min(found) if found else 'None'} - {max(found) if found else 'None'}")
    print(f"Indices: {found}")

if __name__ == "__main__":
    main()
