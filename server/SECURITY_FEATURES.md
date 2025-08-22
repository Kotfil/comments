# 🛡️ Comments Security System

## Security Overview

The system includes multi-layered protection against various types of attacks and threats.

## 🔒 XSS Attack Protection

### Frontend (Apollo Client)
- **Automatic sanitization** of all input data
- **HTML tag filtering** (`<script>`, `<iframe>`)
- **JavaScript blocking** (`javascript:`, `onclick=`)
- **Data validation** before sending

### Backend (NestJS)
- **Middleware sanitization** of all incoming data
- **Helmet.js** for secure headers
- **XSS-Clean** for additional protection
- **DTO validation** with class-validator

## 🚫 DDoS Attack Protection

### Frontend
- **Request throttling** - maximum 10 requests per second
- **Debounce** to prevent spam
- **Retry logic** with exponential backoff

### Backend
- **Rate Limiting** - 100 requests in 15 minutes per IP
- **IP-based throttling** - 100 requests per minute
- **Suspicious User-Agent blocking**
- **Bot and scraper protection**

## ⏱️ Timing and Monitoring

### Frontend
- **Slow query logging** (>1 second)
- **Performance metrics** Apollo Client
- **Error and timeout tracking**

### Backend
- **Interceptor logging** of all GraphQL operations
- **Performance monitoring** with metrics
- **Alerts for slow queries** (>2 seconds)
- **Success and error statistics**

## 🚨 Additional Protection

### GraphQL Security
- **Query depth limitation** (maximum 10 levels)
- **Query complexity limitation** (maximum 1000 fields)
- **Introspection blocking** in production
- **Query pattern validation**

### HTTP Security
- **Helmet.js** for secure headers
- **Content Security Policy** (CSP)
- **HTTP Strict Transport Security** (HSTS)
- **MIME sniffing protection**

## 📊 Security Metrics

### Monitoring
- **Number of requests** per second
- **Percentage of slow queries**
- **Number of blocked IPs**
- **Error statistics** by type

### Alerts
- **Critical errors** (>500ms)
- **Slow queries** (>1 second)
- **Request limit exceeded**
- **Suspicious activity**

## 🛠️ Configuration

### Environment Variables
```bash
# Request limits
MAX_REQUESTS_PER_MINUTE=100
RATE_LIMIT_WINDOW_MS=900000

# Performance thresholds
SLOW_QUERY_THRESHOLD=1000
ERROR_THRESHOLD=500

# GraphQL limitations
MAX_QUERY_DEPTH=10
MAX_QUERY_COMPLEXITY=1000
```

### Apollo Client Configuration
```typescript
// Throttling
throttleLink: 10 requests/second

// Retry logic
retryLink: 3 attempts with exponential backoff

// Error handling
errorPolicy: 'all'
```

## 🔍 Logging

### Log Levels
- **INFO**: Successful requests
- **WARN**: Slow queries
- **ERROR**: Errors and failures
- **CRITICAL**: Critical problems

### Log Format
```json
{
  "timestamp": "2024-01-01T00:00:00.000Z",
  "level": "WARN",
  "message": "Slow query detected: 1500ms",
  "context": {
    "duration": 1500,
    "ip": "192.168.1.1",
    "operation": "comments",
    "userAgent": "Mozilla/5.0..."
  }
}
```

## 🚀 Deployment

### Production Settings
- **Disable introspection**
- **Strict CSP directives**
- **File logging**
- **Prometheus monitoring**

### Monitoring
- **Grafana dashboards**
- **Slack/Email alerts**
- **InfluxDB metrics**
- **Jaeger tracing**

## 📚 Additional Resources

- [NestJS Security](https://docs.nestjs.com/security)
- [Apollo Client Security](https://www.apollographql.com/docs/react/security/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [GraphQL Security](https://graphql.org/learn/security/)
