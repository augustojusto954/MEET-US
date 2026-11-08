# Executar na pasta "frontend" (a raiz do projeto Quasar)
# Cria pastas e ficheiros vazios. Ficheiros que ja existem NAO sao alterados.

$pastas = @(
  "public",
  "tests",
  "src/assets/images", "src/assets/icons", "src/assets/styles",
  "src/boot",
  "src/components/common", "src/components/profile", "src/components/matching",
  "src/components/chat", "src/components/notifications", "src/components/exchange",
  "src/layouts",
  "src/pages/auth", "src/pages/dashboard", "src/pages/profile", "src/pages/students",
  "src/pages/matching", "src/pages/exchanges", "src/pages/chat", "src/pages/calls",
  "src/pages/notifications", "src/pages/reviews", "src/pages/leaderboard",
  "src/pages/settings", "src/pages/errors",
  "src/router", "src/stores", "src/services", "src/composables", "src/utils", "src/css"
)

$ficheiros = @(
  "src/boot/axios.js", "src/boot/socket.js",
  "src/layouts/MainLayout.vue", "src/layouts/AuthLayout.vue",
  "src/pages/auth/LoginPage.vue", "src/pages/auth/RegisterPage.vue", "src/pages/auth/ForgotPasswordPage.vue",
  "src/pages/dashboard/DashboardPage.vue",
  "src/pages/profile/ProfilePage.vue",
  "src/pages/students/SearchStudentsPage.vue",
  "src/pages/matching/MatchingPage.vue",
  "src/pages/exchanges/ExchangeRequestsPage.vue", "src/pages/exchanges/ExchangeDetailsPage.vue",
  "src/pages/chat/ConversationsPage.vue", "src/pages/chat/ChatPage.vue",
  "src/pages/calls/CallPage.vue",
  "src/pages/notifications/NotificationsPage.vue",
  "src/pages/reviews/ReviewsPage.vue",
  "src/pages/leaderboard/LeaderboardPage.vue",
  "src/pages/settings/AccountPage.vue", "src/pages/settings/PrivacyPage.vue",
  "src/pages/errors/NotFoundPage.vue",
  "src/router/index.js", "src/router/routes.js",
  "src/stores/auth.js", "src/stores/profile.js", "src/stores/matching.js",
  "src/stores/chat.js", "src/stores/notifications.js",
  "src/services/auth.service.js", "src/services/profile.service.js", "src/services/students.service.js",
  "src/services/matching.service.js", "src/services/exchange.service.js", "src/services/chat.service.js",
  "src/services/upload.service.js", "src/services/calls.service.js", "src/services/notifications.service.js",
  "src/composables/useAuth.js", "src/composables/useSocket.js", "src/composables/useMediaDevices.js"
)

foreach ($p in $pastas) {
  New-Item -ItemType Directory -Force -Path $p | Out-Null
}

foreach ($f in $ficheiros) {
  if (-not (Test-Path $f)) {
    New-Item -ItemType File -Path $f | Out-Null
    Write-Host "criado:   $f"
  } else {
    Write-Host "ja existe: $f"
  }
}

# Mover a pagina 404 de exemplo do Quasar para o novo local (so se o destino estiver vazio)
$antigo = "src/pages/ErrorNotFound.vue"
$novo = "src/pages/errors/NotFoundPage.vue"
if ((Test-Path $antigo) -and ((Get-Item $novo).Length -eq 0)) {
  Move-Item -Force $antigo $novo
  Write-Host "movido:   $antigo -> $novo"
}

Write-Host "`nEstrutura criada."