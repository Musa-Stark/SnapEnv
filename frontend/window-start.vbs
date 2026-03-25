Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "cmd /c npm run dev", 0
WScript.Sleep 3000
WshShell.Run "http://localhost:3000"