import sys

def read_chunk(filename, offset, length):
    try:
        offset = int(offset)
        length = int(length)
        with open(filename, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            
        data = content[offset : offset + length]
        
        with open('chunk_out.txt', 'w', encoding='utf-8') as out:
            out.write(f"--- Chunk at {offset} length {length} (Character Index) ---\n")
            out.write(repr(data))
            out.write("\n-----------------------------------------\n")
    except Exception as e:
        with open('chunk_out.txt', 'w') as out:
            out.write(f"Error: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 4:
        with open('chunk_out.txt', 'w') as out:
            out.write("Usage error")
    else:
        read_chunk(sys.argv[1], sys.argv[2], sys.argv[3])
