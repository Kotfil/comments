# 💬 Comments System

A full-featured commenting system with a client on Next.js and a server on NestJS.

## 🏗️ Architecture

### Frontend (Client)
- **Next.js 14** with TypeScript
- **Material-UI** for components
- **Styled Components** for styling
- **Apollo Client** for GraphQL
- **Atomic Design** architecture

### Backend (Server)
- **NestJS** with TypeScript
- **TypeORM** for database operations
- **PostgreSQL** as the main database
- **GraphQL** API with Apollo Server
- **Docker** for deployment

## 🚀 Quick start

### 1. Cloning and installation
```bash
git clone <repository-url>
cd comments

# Installing client dependencies
cd client
pnpm install

# Installing server dependencies
cd ../server
pnpm install
```

### 2. Start the database
```bash
cd server
# Make sure Docker is running
docker-compose up -d postgres
```

### 3. Start the server
```bash
cd server
pnpm start:dev
```

### 4. Start the client
```bash
cd client
pnpm dev
```

## 🌐 Available services

- **Client**: http://localhost:3000
- **Server**: http://localhost:4000
- **GraphQL**: http://localhost:4000/graphql
- **pgAdmin**: http://localhost:5050 (admin@admin.com / admin)

## 📁 Project structure

```
comments/
├── client/                 # Next.js client
│   ├── src/
│   │   ├── components/    # Atomic Design components
│   │   ├── graphql/       # GraphQL schemas and types
│   │   ├── hooks/         # React hooks
│   │   └── app/           # Next.js pages
│   └── package.json
├── server/                 # NestJS server
│   ├── src/
│   │   ├── entities/      # TypeORM entities
│   │   ├── services/      # Business logic
│   │   ├── resolvers/     # GraphQL resolvers
│   │   └── modules/       # NestJS modules
│   ├── docker-compose.yml # PostgreSQL
│   └── package.json
└── README.md
```

## 🔧 Main features

### Client
- ✅ Create comments and replies
- ✅ Hierarchical display
- ✅ Pagination (25 comments per page)
- ✅ Polling for real-time updates
- ✅ Form validation
- ✅ Responsive design

### Server
- ✅ GraphQL API
- ✅ PostgreSQL with TypeORM
- ✅ Data validation
- ✅ Hierarchical comments
- ✅ Automatic migrations

## 🎨 Atomic Design

### Atoms
- Button, Input, Typography, Avatar, IconButton

### Molecules
- FormField, HTMLToolbar, CommentHeader, Pagination

### Organisms
- CommentItem, CommentForm, CommentCard

### Templates
- CommentModal, CommentsLayout

### Pages
- CommentsPage, HierarchicalCommentsPage

## 📊 GraphQL Schema

### Queries
```graphql
query {
  comments {
    id
    author
    content
    replies {
      id
      author
      content
    }
  }
}
```

### Mutations
```graphql
mutation {
  createComment(input: {
    author: “John Doe”
    email: “john@example.com”
    content: “Great post!”
  }) {
    id
    author
    content
  }
}
```

## 🗄️ Database

### `comments` table
- UUID primary key
- Hierarchical structure (parent_id)
- Automatic timestamps
- Database-level validation

### Indexes
- parent_id for quick search of replies
- homepage for search by URL
- created_at for sorting

## 🚀 Deployment

### Development
```bash
# Client
cd client && pnpm dev

# Server
cd server && pnpm start:dev

# Database
cd server && docker-compose up -d
```

### Production
```bash
# Client
cd client && pnpm build && pnpm start

# Server
cd server && pnpm build && pnpm start:prod
```

## 🧪 Testing

### Client
```bash
cd client
pnpm test
```

### Server
```bash
cd server
pnpm test
```

## 📚 Documentation

- [Client](./client/README.md) - Details of the Next.js application
- [Server](./server/README.md) - Details of the NestJS API
- [Integration](./server/CLIENT_INTEGRATION.md) - How to connect the client to the server
- [Quick Start](./server/QUICK_START.md) - Quick start of the server

## 🔒 Security

- Input data validation
- CORS settings
- Prepared SQL queries
- Database-level restrictions

## 📈 Performance

- React.memo and useCallback for optimization
- Apollo Client caching
- TypeORM lazy loading
- Database indexes for fast queries

## 🤝 Contributing to the project

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

MIT License

## 🆘 Support

If you encounter any issues:
1. Check the server and client logs
2. Ensure PostgreSQL is available
3. Check the environment variables
4. Create an issue with a description of the problem

---
## dzencode
**Created with  using modern development technologies**