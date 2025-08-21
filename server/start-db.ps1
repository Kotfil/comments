# Скрипт для запуска PostgreSQL через Docker
Write-Host "🚀 Запуск PostgreSQL через Docker..." -ForegroundColor Green

# Проверяем, запущен ли Docker
try {
    docker version | Out-Null
    Write-Host "✅ Docker доступен" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker не доступен. Убедитесь, что Docker Desktop запущен." -ForegroundColor Red
    exit 1
}

# Останавливаем существующие контейнеры
Write-Host "🛑 Остановка существующих контейнеров..." -ForegroundColor Yellow
docker-compose down

# Запускаем PostgreSQL
Write-Host "🐘 Запуск PostgreSQL..." -ForegroundColor Yellow
docker-compose up -d postgres

# Ждем запуска PostgreSQL
Write-Host "⏳ Ожидание запуска PostgreSQL..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Проверяем статус
Write-Host "🔍 Проверка статуса..." -ForegroundColor Yellow
docker-compose ps

Write-Host "✅ PostgreSQL запущен!" -ForegroundColor Green
Write-Host "📊 База данных: localhost:5432" -ForegroundColor Cyan
Write-Host "👤 Пользователь: postgres" -ForegroundColor Cyan
Write-Host "🔑 Пароль: password" -ForegroundColor Cyan
Write-Host "🗄️ База: comments_db" -ForegroundColor Cyan
Write-Host "" -ForegroundColor White
Write-Host "💡 Для подключения используйте:" -ForegroundColor Yellow
Write-Host "   - pgAdmin: http://localhost:5050 (admin@admin.com / admin)" -ForegroundColor Cyan
Write-Host "   - psql: psql -h localhost -U postgres -d comments_db" -ForegroundColor Cyan
Write-Host "" -ForegroundColor White
Write-Host "🛑 Для остановки: docker-compose down" -ForegroundColor Yellow
