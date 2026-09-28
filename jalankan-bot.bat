@echo off
TITLE Command Center Eko - Auto Bot Runner
color 0a
echo ====================================================
echo   MEMULAI SERVER DAN DASHBOARD AUTOMATION SYSTEM...
echo ====================================================

:: Menjalankan server Node.js di jendela terminal terpisah
start cmd /k "node server.js"

:: Jeda 2 detik agar server siap sepenuhnya
timeout /t 2 >nul

:: Membuka dashboard admin di browser default
start "" "dashboard-admin.html"

exit