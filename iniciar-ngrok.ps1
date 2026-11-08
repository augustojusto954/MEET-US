# Iniciar túnel ngrok para MEET-US
Write-Host "Iniciando túnel ngrok para MEET-US na porta 3000..." -ForegroundColor Green
ngrok http 3000 --url wrench-astrology-satchel.ngrok-free.dev
