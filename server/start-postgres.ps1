# Скрипт для запуска PostgreSQL в Docker
Write-Host "🚀 Запуск PostgreSQL в Docker..." -ForegroundColor Green

# Проверяем, запущен ли Docker
if (-not (docker info 2>$null)) {
    Write-Host "❌ Docker не запущен! Запустите Docker Desktop и попробуйте снова." -ForegroundColor Red
    exit 1
}

# Останавливаем существующий контейнер, если он есть
Write-Host "🛑 Остановка существующего контейнера PostgreSQL..." -ForegroundColor Yellow
docker stop postgres-comments 2>$null
docker rm postgres-comments 2>$null

# Запускаем новый контейнер PostgreSQL
Write-Host "🐘 Запуск PostgreSQL контейнера..." -ForegroundColor Yellow
docker run -d `
    --name postgres-comments `
    -e POSTGRES_DB=comments_db `
    -e POSTGRES_USER=postgres `
    -e POSTGRES_PASSWORD=postgres `
    -p 5432:5432 `
    postgres:15

# Ждем, пока PostgreSQL запустится
Write-Host "⏳ Ожидание запуска PostgreSQL..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Проверяем статус
$containerStatus = docker ps --filter "name=postgres-comments" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
Write-Host "📊 Статус контейнера:" -ForegroundColor Green
Write-Host $containerStatus

Write-Host "✅ PostgreSQL запущен успешно!" -ForegroundColor Green
Write-Host "🌐 Доступен по адресу: localhost:5432" -ForegroundColor Cyan
Write-Host "🔑 Логин: postgres" -ForegroundColor Cyan
Write-Host "🔑 Пароль: postgres" -ForegroundColor Cyan
Write-Host "🗄️ База данных: comments_db" -ForegroundColor Cyan

Write-Host "`n📝 Для создания базы данных выполните:" -ForegroundColor Yellow
Write-Host "docker exec -i postgres-comments psql -U postgres < setup-database.sql" -ForegroundColor White

Write-Host "`n🎯 Теперь можно запускать сервер командой: npm run start:dev" -ForegroundColor Green
