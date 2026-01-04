
import os
try:
    with open("c:/Users/adyba/clone of game/gateway.log", "a") as f:
        f.write("TEST LOG ENTRY\n")
    print("Write success")
except Exception as e:
    print(f"Write failed: {e}")
