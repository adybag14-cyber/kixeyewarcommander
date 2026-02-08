@echo off
cd /d "%~dp0"
python -u server.py > server_out.txt 2>&1
