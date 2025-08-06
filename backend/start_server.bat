@echo off
cd /d "%~dp0"
set PYTHONPATH=%CD%
D:/Users/xumoe-c/Documents/Code/HTML/ronghua_introduction/.venv/Scripts/python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
