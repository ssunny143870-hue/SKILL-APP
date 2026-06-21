Local server instructions for inline video playback

1) From PowerShell (recommended):

```powershell
cd "c:\Users\admin\Downloads\WhatsApp Unknown 2026-06-19 at 10.56.46 PM"
.\serve.ps1
```

2) From Command Prompt:

```cmd
cd "c:\Users\admin\Downloads\WhatsApp Unknown 2026-06-19 at 10.56.46 PM"
serve.bat
```

3) If you prefer Python directly:

```powershell
cd "c:\Users\admin\Downloads\WhatsApp Unknown 2026-06-19 at 10.56.46 PM"
python -m http.server 8000
```

4) Open the videos page in your browser:

http://localhost:8000/videos.html

Notes:
- The inline YouTube embed requires `http`/`https` origin. Running from `file://` will show a fallback that opens YouTube directly.
- If you get port-in-use, change `8000` to another free port (e.g., `9000`) in the commands above.
