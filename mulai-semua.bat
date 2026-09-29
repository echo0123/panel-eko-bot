@echo off
TITLE Command Center & User Portal Eko
color 0a
echo ====================================================
echo   MEMULAI SERVER DAN SEMUA PANEL SISTEM...
echo ====================================================

:: 1. Menjalankan server Node.js di jendela terminal terpisah
start cmd /k "node server.js"

:: 2. Jeda 2 detik agar server siap sepenuhnya
timeout /t 2 >nul

:: 3. Membuka Dashboard Admin di browser
start "" "dashboard-admin.html"

:: 4. Membuka Halaman Login User di browser
start "" "login-user.html"

exit