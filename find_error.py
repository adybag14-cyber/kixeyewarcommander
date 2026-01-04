
filename = "c:/Users/adyba/clone of game/js/warcommander.patched.js"
search_string = "GatewayConnection::sendMessage - Sending message: connection is closed"

try:
    with open(filename, 'r', encoding='utf-8') as f:
        for i, line in enumerate(f):
            if search_string in line:
                print(f"Match at line {i+1}: {line.strip()[:200]}...")
except Exception as e:
    print(f"Error: {e}")
