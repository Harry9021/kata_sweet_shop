# Sweet Shop Management System - Backend

A RESTful API backend for managing a sweet shop, built with Node.js, TypeScript, Express, and MongoDB.

## Features

- 🔐 **JWT Authentication** - Dual-token system (access + refresh tokens)
- 👥 **Role-Based Access Control** - User and Admin roles
- 🍬 **Sweet Management** - CRUD operations for sweets
- 🔍 **Search & Filter** - Search by name, category, and price range
- 🛒 **Inventory Management** - Purchase and restock functionality
- ✅ **Input Validation** - Request validation using express-validator
- 🛡️ **Error Handling** - Centralized error handling middleware

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: express-validator
- **Password Hashing**: bcryptjs

## Project Structure

```
backend/
├── src/
│   ├── configs/           # Configuration files
│   │   ├── database.config.ts
│   │   └── jwt.config.ts
│   ├── models/            # Mongoose models
│   │   ├── user.model.ts
│   │   ├── sweet.model.ts
│   │   └── refreshToken.model.ts
│   ├── services/          # Business logic layer
│   │   ├── auth.service.ts
│   │   └── sweet.service.ts
│   ├── middlewares/       # Express middlewares
│   │   ├── auth.middleware.ts
│   │   ├── role.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── validation.middleware.ts
│   ├── routes/            # API routes/controllers
│   │   ├── auth.routes.ts
│   │   └── sweet.routes.ts
│   └── server.ts          # Application entry point
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kata_sweet_shop/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the backend directory:
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/sweet_shop
   JWT_ACCESS_SECRET=your-super-secret-access-key
   JWT_REFRESH_SECRET=your-super-secret-refresh-key
   JWT_ACCESS_EXPIRY=15m
   JWT_REFRESH_EXPIRY=7d
   ```

4. **Start MongoDB**
   
   Make sure MongoDB is running on your system:
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB Atlas cloud instance
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:5000`

### Build for Production

```bash
npm run build
npm start
```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| POST | `/api/auth/refresh` | Refresh access token | Public |
| POST | `/api/auth/logout` | Logout and revoke refresh token | Public |

### Sweets Management

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/sweets` | Create a new sweet | Admin |
| GET | `/api/sweets` | Get all sweets | Authenticated |
| GET | `/api/sweets/search` | Search sweets | Authenticated |
| GET | `/api/sweets/:id` | Get sweet by ID | Authenticated |
| PUT | `/api/sweets/:id` | Update sweet | Admin |
| DELETE | `/api/sweets/:id` | Delete sweet | Admin |
| POST | `/api/sweets/:id/purchase` | Purchase sweet | Authenticated |
| POST | `/api/sweets/:id/restock` | Restock sweet | Admin |

## API Usage Examples

### Register a User

```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "role": "user"
}
```

### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "email": "user@example.com",
      "role": "user",
      "createdAt": "..."
    },
    "tokens": {
      "accessToken": "...",
      "refreshToken": "..."
    }
  }
}
```

### Create a Sweet (Admin)

```bash
POST /api/sweets
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Chocolate Bar",
  "category": "Chocolate",
  "price": 2.50,
  "quantity": 100,
  "description": "Delicious milk chocolate bar"
}
```

### Search Sweets

```bash
GET /api/sweets/search?name=chocolate&minPrice=1&maxPrice=5
Authorization: Bearer <access_token>
```

### Purchase Sweet

```bash
POST /api/sweets/:id/purchase
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "quantity": 5
}
```

## Authentication Flow

1. **Register/Login** - User receives access token (15min) and refresh token (7 days)
2. **API Requests** - Include access token in Authorization header: `Bearer <token>`
3. **Token Refresh** - When access token expires, use refresh token to get new access token
4. **Logout** - Revoke refresh token from database

## Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/expired token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Development

### Running Tests

```bash
npm test
```

### Test Coverage

```bash
npm test -- --coverage
```

## My AI Usage

This project was developed with assistance from AI tools to accelerate development and ensure best practices.

### AI Tools Used

- **Google Gemini** - Primary AI assistant for code generation and architecture design

### How AI Was Used

1. **Architecture Design** - Used Gemini to design the class-based architecture with proper separation of concerns (configs, models, services, routes, middlewares)

2. **Boilerplate Generation** - Generated initial boilerplate for:
   - TypeScript configuration
   - Express server setup
   - Mongoose models with validation
   - JWT authentication utilities
   - Middleware implementations

3. **Code Implementation** - AI assisted in writing:
   - Service layer business logic (AuthService, SweetService)
   - Route controllers with validation
   - Error handling middleware
   - Database configuration with connection management

4. **Best Practices** - AI helped ensure:
   - Proper TypeScript typing throughout
   - Input validation using express-validator
   - Secure password hashing with bcrypt
   - JWT token rotation and refresh mechanism
   - RESTful API design patterns

### Reflection on AI Impact

**Positive Impacts:**
- **Accelerated Development** - AI significantly reduced development time by generating well-structured boilerplate code
- **Best Practices** - AI suggested industry-standard patterns for authentication, error handling, and API design
- **Code Quality** - Generated code followed TypeScript best practices with proper typing and error handling
- **Learning** - Reviewing AI-generated code helped understand advanced patterns like dual-token authentication

**Manual Refinements:**
- Customized validation rules for sweet categories
- Adjusted error messages for better user experience
- Fine-tuned MongoDB indexes for search performance
- Configured environment variables for deployment flexibility

**Overall Assessment:**
AI tools like Gemini are invaluable for modern development, especially for:
- Rapid prototyping
- Implementing well-known patterns
- Reducing boilerplate code
- Ensuring consistent code style

However, human oversight remains critical for:
- Business logic decisions
- Security considerations
- Performance optimization
- Code review and testing

## License

ISC

## Author

Developed as part of the TDD Kata: Sweet Shop Management System
