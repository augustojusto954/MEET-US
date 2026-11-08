@echo off
title MEET-US - Tunel Publico ngrok
color 0A
cls
echo ===================================================================
echo             MEET-US - INICIAR TUNEL PUBLICO OFICIAL
echo ===================================================================
echo.
echo Dominio Estatico: https://wrench-astrology-satchel.ngrok-free.dev
echo Encaminhamento:  http://localhost:3000
echo.
echo A ligar o ngrok...
echo.

ngrok http 3000 --url https://wrench-astrology-satchel.ngrok-free.dev

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Tentando comando alternativo com ngrok start meetus...
    ngrok start meetus
)

pause
