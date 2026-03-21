# MoveIQ Backend API

Backend service powering the **MoveIQ** commuter intelligence platform for Lagos, Nigeria.

MoveIQ collects crowdsourced traffic incident reports and provides real-time commuter insights across major Lagos corridors. Users can report incidents (accidents, roadblocks, heavy traffic), upvote or downvote reports, comment for context, and track route conditions — all in real time.

---

## Tech Stack

| Technology | Purpose |
| --- | --- |
| **Node.js** | Runtime environment |
| **Express 5** | HTTP framework |
| **MongoDB Atlas** | Cloud database |
| **Mongoose 9** | ODM for MongoDB |
| **JWT** | Authentication tokens |
| **bcryptjs** | Password hashing |
| **Joi** | Request validation |
| **Helmet** | Security headers |
| **Morgan** | HTTP request logging |
| **express-rate-limit** | Rate limiting |
| **google-auth-library** | Google OAuth verification |

---

## Architecture

MoveIQ uses a **layered architecture** that enforces strict separation of concerns. Every request follows a one-directional flow:

```text
Route → Validator → Controller → Service → Database → Model
```

Each layer has a single responsibility and communicates only with the layer directly below it. This makes the codebase predictable, testable, and easy to extend.

### Request Flow

1. **Route** — Receives the HTTP request and maps it to the correct controller.
2. **Validator** — Validates the request body using a Joi schema before the controller executes.
3. **Controller** — Extracts request data, delegates to the service, and sends the response.
4. **Service** — Contains business logic (e.g. vote toggling, password hashing, expiry extension).
5. **Database** — Executes Mongoose queries against the database.
6. **Model** — Defines the MongoDB schema and data shape.

---

## Project Structure

```text
src/
├── config/            # Environment and database configuration
├── controllers/       # Request handlers (thin — delegate to services)
├── services/          # Business logic layer
├── database/          # Mongoose query functions
├── models/            # Mongoose schemas and models
├── routes/            # Express route definitions
├── middlewares/       # Auth, error handling, rate limiting, validation
├── validators/        # Joi validation schemas
├── utils/             # Shared utilities (error classes, response helpers, logger)
├── data/              # Seed data for initial routes
├── app.js             # Express app configuration (middleware, routes, error handlers)
├── server.js          # Server startup and MongoDB connection
└── seed.js            # Database seeding script
```

### Folder Responsibilities

#### `config/`

Manages environment configuration and database connections.

- **`env.js`** — Loads `.env` variables via `dotenv` and exports them as a single config object.
- **`db.js`** — Connects to MongoDB Atlas using the connection string from `env.js`.

> **Should NOT** contain business logic or route definitions.

#### `controllers/`

Handle HTTP requests and responses. Controllers are intentionally **thin** — they extract data from `req`, call the appropriate service, and return the result using the standard response format.

- Receives parsed request data (params, body, query).
- Calls service functions.
- Returns responses using `successResponse()`.
- Throws `ApiError` for client errors (400, 404).

> **Should NOT** contain business logic, direct database queries, or password hashing.

#### `services/`

Contains all **business logic**. This is where decisions are made.

- Validates business rules (e.g. "has this user already upvoted?").
- Orchestrates between multiple database calls when needed.
- Hashes passwords, generates tokens, toggles votes.
- Throws `ApiError` when a business rule is violated.

> **Should NOT** access `req` or `res` objects, or return HTTP responses.

#### `database/`

Encapsulates all **Mongoose queries**. Each file corresponds to a model.

- Provides functions like `createUser()`, `findIncidentById()`, `searchRoutes()`.
- Handles population of referenced fields (e.g. `reportedBy`, `createdBy`).
- Returns raw Mongoose documents to the service layer.

> **Should NOT** contain business logic, validation, or error formatting.

#### `models/`

Defines **Mongoose schemas** that describe the shape of each MongoDB collection.

- Specifies field types, defaults, enums, required fields, and indexes.
- Uses constants from `utils/constants.js` for enum values.
- Contains pre-save hooks (e.g. auto-generating route slugs).

> **Should NOT** contain business logic or query functions.

#### `routes/`

Maps HTTP methods and paths to the correct controller, optionally applying validation and auth middleware.

- Defines route paths and HTTP methods.
- Applies `protect` middleware to secured endpoints.
- Applies `validate(schema)` middleware for input validation.
- Orders routes carefully (specific paths like `/search` before parametric `/:id`).

> **Should NOT** contain any logic beyond route wiring.

#### `middlewares/`

Cross-cutting concerns that run before or after controllers.

- **`auth.middleware.js`** — Verifies JWT tokens and attaches `req.user`.
- **`validation.middleware.js`** — Validates `req.body` against a Joi schema.
- **`error.middleware.js`** — Centralized error handler that catches all thrown errors.
- **`rateLimit.middleware.js`** — Configures request rate limits for auth and general endpoints.

#### `validators/`

Joi schemas that define what valid request data looks like.

- **`auth.validator.js`** — Schemas for register, login, forgot-password, reset-password, update-profile.
- **`incident.validator.js`** — Schemas for creating, updating incidents, and adding comments.

> Each schema is consumed by the `validate()` middleware in routes.

#### `utils/`

Shared utilities used across all layers.

- **`apiError.js`** — Custom `ApiError` class with `statusCode` for consistent error responses.
- **`apiResponse.js`** — `successResponse()` and `errorResponse()` helpers for standard JSON output.
- **`asyncHandler.js`** — Wraps async route handlers to forward thrown errors to the error middleware.
- **`constants.js`** — Shared constants: `INCIDENT_TYPES`, `ROUTE_STATUS`, `VOTE_TYPES`, `PAGINATION`.
- **`logger.js`** — Simple logging utility (`info`, `error`, `warn`).

---

## Key System Components

### Authentication

MoveIQ uses a **dual-token system** for secure session management:

- **Access Token** — Short-lived (15 minutes), sent in the `Authorization: Bearer` header for every protected request.
- **Refresh Token** — Long-lived (7 days), stored server-side in the user document. Used to obtain new access tokens without re-login.
- Passwords are hashed with **bcryptjs** before storage.
- The `protect` middleware verifies the access token and attaches the user to `req.user`.

### Google OAuth

- Users can authenticate via **Google Sign-In** using the `POST /api/auth/google` endpoint.
- The backend verifies the Google ID token using `google-auth-library`.
- If a local user logs in with Google for the first time, their account is **linked** (provider updated to `google`).
- Google users are **auto-verified** (no email verification needed) and **cannot** use forgot/reset password.

### Email Verification

- On registration, a `verificationToken` is generated and returned.
- The frontend sends the user to `GET /api/auth/verify-email/:token` to verify their email.
- Unverified users can still log in (verification enforcement is up to the frontend/business rules).

### Session Management

- **Login/Register**: Returns `accessToken` + `refreshToken`.
- **Token Refresh**: `POST /api/auth/refresh-token` returns a new `accessToken`.
- **Logout**: `POST /api/auth/logout` clears the server-side refresh token, invalidating the session.

### Error Handling

All errors flow through a centralized pipeline:

1. Async controllers are wrapped with `asyncHandler()`, which catches rejected promises.
2. Business logic throws `ApiError` with a message and HTTP status code.
3. The `errorHandler` middleware catches all errors and returns a consistent JSON response.

### Response Structure

All API responses follow a standard format:

**Success:**

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

**Error:**

```json
{
  "success": false,
  "message": "Error description"
}
```

**Validation Error:**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": ["\"password\" is required"]
}
```

### Validation

Request validation uses **Joi** schemas applied as middleware:

1. A Joi schema is defined in `validators/`.
2. The `validate(schema)` middleware is applied in the route definition.
3. If validation fails, a `400` response is returned with the specific error messages.
4. If validation passes, the request proceeds to the controller.

### Rate Limiting

- **Auth endpoints** (`/api/auth/*`): 20 requests per 15 minutes.
- **General endpoints**: 100 requests per 15 minutes.
- Exceeding the limit returns a `429 Too Many Requests` response.

### Logging

- **Morgan** logs all HTTP requests in `dev` format during development.
- A custom **logger** utility provides `info`, `error`, and `warn` methods for application-level logging.

---

## API Modules

### Auth (`/api/auth`)

User registration, login, Google OAuth, token management, email verification, profile management, and password recovery. Supports email, phone, and Google authentication. Access and refresh tokens are issued on login/register.

| Method | Endpoint | Auth | Description |
| ------ | -------- | ---- | ----------- |
| POST | `/register` | No | Register and receive access + refresh tokens |
| POST | `/login` | No | Login and receive access + refresh tokens |
| POST | `/google` | No | Google OAuth login |
| POST | `/refresh-token` | No | Get new access token using refresh token |
| GET | `/verify-email/:token` | No | Verify user email address |
| GET | `/current-user` | Yes | Get authenticated user profile |
| PUT | `/profile` | Yes | Update user profile |
| POST | `/logout` | Yes | Logout and invalidate refresh token |
| POST | `/forgot-password` | No | Request password reset token |
| POST | `/reset-password/:token` | No | Reset password with token |

### Routes (`/api/routes`)

Manage Lagos commuter corridors. Routes are seeded with 10 priority Lagos routes and can be created by authenticated users. Each route auto-generates a URL-safe slug from its name.

| Method | Endpoint | Auth | Description |
| ------ | -------- | ---- | ----------- |
| POST | `/` | Yes | Create a new route |
| GET | `/` | No | Get all routes |
| GET | `/search?q=` | No | Search routes by name or location |
| GET | `/history` | No | Get route history (newest first) |
| GET | `/:id` | No | Get a single route |
| GET | `/:id/details` | No | Get route with creator info |
| GET | `/:id/incidents` | No | Get incidents for a route |
| DELETE | `/:id` | Yes | Delete a route |

### Incidents (`/api/incidents`)

Core feature — crowdsourced incident reporting. Users report incidents (Heavy Traffic, Roadblock, Accident) at specific GPS coordinates linked to routes. Incidents support upvoting/downvoting (mutually exclusive), community comments, and lifecycle management (still-there/cleared).

| Method | Endpoint | Auth | Description |
| ------ | -------- | ---- | ----------- |
| POST | `/` | Yes | Report a new incident |
| GET | `/` | Yes | Get all incidents |
| GET | `/nearby?latitude=&longitude=` | Yes | Get incidents near a location |
| GET | `/route/:routeId` | Yes | Get incidents for a route |
| GET | `/:id` | Yes | Get a single incident |
| PUT | `/:id` | Yes | Update an incident |
| DELETE | `/:id` | Yes | Delete an incident |
| PATCH | `/:id/upvote` | Yes | Upvote (removes downvote) |
| PATCH | `/:id/downvote` | Yes | Downvote (removes upvote) |
| PATCH | `/:id/still-there` | Yes | Extend incident expiry |
| PATCH | `/:id/cleared` | Yes | Mark incident as cleared |
| POST | `/:id/comments` | Yes | Add a comment |
| GET | `/:id/comments` | Yes | Get comments |
| DELETE | `/:id/comments/:commentId` | Yes | Delete a comment |

### Notifications (`/api/notifications`)

User-scoped notifications for route and incident events.

| Method | Endpoint | Auth | Description |
| ------ | -------- | ---- | ----------- |
| GET | `/` | Yes | Get user notifications |
| PATCH | `/:id/read` | Yes | Mark notification as read |

### Activity (`/api/activities`)

Combined feed of the latest incidents and route creations, sorted by recency.

| Method | Endpoint | Auth | Description |
| ------ | -------- | ---- | ----------- |
| GET | `/` | No | Get activity feed |

### Reports (`/api/reports`)

Feed of the most recent incident reports.

| Method | Endpoint | Auth | Description |
| ------ | -------- | ---- | ----------- |
| GET | `/feed` | No | Get latest reports |

### Health & Root

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | `/` | API status check |
| GET | `/health` | Uptime and health check |

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/org/moveiq-backend.git
cd moveiq-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment file

Create a `.env` file in the project root:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_access_token_secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your_google_client_id
```

### 4. Seed the database

Populate the database with 10 priority Lagos routes:

```bash
npm run seed
```

### 5. Run the server

```bash
# Development (auto-restart on changes)
npm run dev

# Production
npm start
```

The server will start at `http://localhost:5000`.

---

## Coding Standards

### Naming Conventions

- **Files**: `kebab-case` with layer suffix — `auth.controller.js`, `incident.service.js`, `user.database.js`.
- **Variables and functions**: `camelCase` — `getIncidentById`, `saveRouteService`.
- **Constants**: `UPPER_SNAKE_CASE` — `INCIDENT_TYPES`, `ROUTE_STATUS`.
- **Models**: `PascalCase` — `User`, `Incident`, `Route`.

### Architecture Rules

1. **Controllers never access models directly.** All database operations go through the service and database layers.
2. **Services never access `req` or `res`.** They receive plain data and return plain data.
3. **Database functions are pure query wrappers.** No business logic in the database layer.
4. **All secrets come from `config/env.js`.** Never hardcode credentials.
5. **All async route handlers use `asyncHandler`.** This ensures errors propagate to the error middleware.
6. **Constants are shared via `utils/constants.js`.** No magic strings in business logic.

---

## Postman Collection

A complete Postman collection with all endpoints is included at:

```text
MoveIQ_API.postman_collection.json
```

Import it into Postman to test all endpoints. The collection includes:

- Pre-configured variables (`baseUrl`, `token`).
- Auto-save token on login/register.
- Example request bodies and responses.

---

## Git Workflow

| Branch | Purpose |
| --- | --- |
| `main` | Production-ready code |
| `develop` | Integration branch |
| `feature/*` | Individual feature branches |

```text
feature branch → pull request → develop → main
```

---

## License

MoveIQ Project
