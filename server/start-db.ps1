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

# Запускаем PostgreSQL, Elasticsearch и Kafka
Write-Host "🐘 Запуск PostgreSQL, Elasticsearch и Kafka..." -ForegroundColor Yellow
docker-compose up -d postgres elasticsearch kibana zookeeper kafka kafka-ui

# Ждем запуска PostgreSQL
Write-Host "⏳ Ожидание запуска PostgreSQL..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Проверяем статус
Write-Host "🔍 Проверка статуса..." -ForegroundColor Yellow
docker-compose ps

Write-Host "✅ PostgreSQL, Elasticsearch и Kafka запущены!" -ForegroundColor Green
Write-Host "📊 PostgreSQL: localhost:5432" -ForegroundColor Cyan
Write-Host "🔍 Elasticsearch: http://localhost:9200" -ForegroundColor Cyan
Write-Host "📊 Kibana: http://localhost:5601" -ForegroundColor Cyan
Write-Host "🚀 Kafka: localhost:9092" -ForegroundColor Cyan
Write-Host "📊 Kafka UI: http://localhost:8080" -ForegroundColor Cyan
Write-Host "👤 Пользователь: postgres" -ForegroundColor Cyan
Write-Host "🔑 Пароль: password" -ForegroundColor Cyan
Write-Host "🗄️ База: comments_db" -ForegroundColor Cyan
Write-Host "" -ForegroundColor White
Write-Host "💡 Для подключения используйте:" -ForegroundColor Yellow
Write-Host "   - pgAdmin: http://localhost:5050 (admin@admin.com / admin)" -ForegroundColor Cyan
Write-Host "   - psql: psql -h localhost -U postgres -d comments_db" -ForegroundColor Cyan
Write-Host "" -ForegroundColor White
Write-Host "🛑 Для остановки: docker-compose down" -ForegroundColor Yellow
