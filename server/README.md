# Comments Server

GraphQL server for comments on NestJS with TypeORM and PostgreSQL.

## 🚀 Quick start

### 1. Install dependencies
```bash
pnpm install
```

### 2. Configure the database
Create a `.env` file based on `env.example`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=comments_db
```

### 3. Create database
```sql
CREATE DATABASE comments_db;
```

### 4. Start the server
```bash
# Development mode
pnpm start:dev

# Production
pnpm build
pnpm start:prod
```

## 📊 GraphQL Playground

After starting, open: http://localhost:4000/graphql

## 🗄️ Data structure

### PostgreSQL

### Table `comments`
- `id` - UUID (Primary Key)
- `author` - VARCHAR(100) - Author name
- `email` - VARCHAR(255) - Author email
- `homepage` - VARCHAR(255) - Homepage URL (optional)
- `avatar` - VARCHAR(10) - Avatar emoji
- `content` - TEXT - Comment content
- `timestamp` - TIMESTAMP - Creation time

- `level` - INTEGER - Nesting level
- `parent_id` - UUID - Parent comment ID (for replies)
- `created_at` - TIMESTAMP - Creation time
- `updated_at` - TIMESTAMP - Update time

## 🔧 Available operations

### Queries
- `comments` - Get all comments
- `comment(id: ID!)` - Get a comment by ID
- `commentByHomepage(homepage: String!)` - Get a comment by HomePage

### Mutations
- `createComment(input: CreateCommentInput!)` - Create a comment
- `createReply(input: CreateReplyInput!)` - Create a reply

- `deleteComment(id: ID!)` - Delete a comment

### Elasticsearch
- `searchComments(query: String!, filters: JSON)` - Search for comments
- `searchByContent(content: String!)` - Search by content
- `searchByAuthor(author: String!)` - Search by author
- `searchByHomepage(homepage: String!)` - Search by HomePage
- `getSuggestions(query: String!)` - Autocomplete

### Kafka Events
- `comment.created` - Comment creation event
- `comment.deleted` - Comment deletion event
- `comment.reply.created` - Reply creation event
- `comment.search.requested` - Comment search request
- `comment.index.requested` - Comment indexing request
- `comment.sync.requested` - Comment synchronization request

## 📁 Project structure

```
src/
├── config/          # TypeORM configuration
├── dto/            # Data Transfer Objects
├── entities/       # TypeORM entities
├── modules/        # NestJS modules
├── resolvers/      # GraphQL resolvers
├── services/       # Business logic
├── app.module.ts   # Main module
└── main.ts         # Entry point
```

## 🛠️ Development commands

```bash
# Build
pnpm build

# Linting
pnpm lint

# Tests
pnpm test

# TypeORM commands
pnpm migration:generate    # Generate migration
pnpm migration:run         # Run migrations
pnpm migration:revert      # Revert migration
pnpm schema:sync          # Synchronize schema
```

## 🌐 API Endpoints

- **GraphQL**: `/graphql`
- **API**: `/api/*`
- **Health Check**: `/api/health`
- **Elasticsearch**: `http://localhost:9200`
- **Kibana**: `http://localhost:5601`
- **Kafka**: `localhost:9092`
- **Kafka UI**: `http://localhost:8080`

## 🔒 Security

- Input data validation via class-validator
- CORS settings for the client
- Prepared SQL queries via TypeORM

## 📝 Query examples

### Get all comments
```graphql
query {
  comments {
    id
    author
    content
    timestamp
    replies {
      id
      author
      content
    }
  }
}
```

### Create a comment
```graphql
mutation {
  createComment(input: {
    author: “John Doe”
    email: “john@example.com”
    content: “Great post!”
    homepage: “johndoe”
  }) {
    id
    author
    content
    timestamp
  }
}
```

## 🚀 Deployment

### Docker (in development)
```bash
docker-compose up -d
```

### Production
```bash
# Install dependencies
pnpm install --production

# Build
pnpm build

# Start
pnpm start:prod
```

## 📞 Support

If you encounter any problems:
1. Check the server logs
2. Make sure PostgreSQL is available
3. Check the environment variables
4. Make sure the GraphQL schema is correct