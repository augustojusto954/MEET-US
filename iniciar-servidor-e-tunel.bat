@echo off
title MEET-US - Servidor e Tunel Publico
echo ========================================================
echo   MEET-US: Plataforma de Mentoria e Troca de Competencias
echo ========================================================
echo Iniciando Servidor Backend e Tunel Cloudflare...
start "MEET-US Backend" cmd /c "node backend/src/server.js"
start "MEET-US Tunel Publico" cmd /c ".\cloudflared.exe tunnel --url http://localhost:3000"
echo ========================================================
echo Servidor e Tunel Iniciados com Sucesso!
echo ========================================================
pause
