
import urllib.request
import json
import sys

def check_endpoint(url):
    print(f"Checking {url}...")
    try:
        req = urllib.request.Request(url, method="POST")
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode('utf-8'))
            print(f"Response keys: {list(data.keys())}")
            if "version" in data:
                print(f"SUCCESS: version found: {data['version']}")
            else:
                print("FAILURE: version NOT found")
                print(json.dumps(data, indent=2))
    except Exception as e:
        print(f"Error: {e}")

check_endpoint("http://localhost:8085/api/player/getinfo")
check_endpoint("http://localhost:8085/api/wc/getflags")
