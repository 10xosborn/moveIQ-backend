# MoveIQ Backend API

Backend service powering the MoveIQ commuter intelligence platform.

The system collects crowdsourced traffic incident reports and provides real-time commuter insights.

## Tech Stack

- Node.js
- Express.js
- MongoDB Atlas

## Project Architecture

```
Route → Validator → Controller → Service → Repository → Database
```

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/org/moveiq-backend.git
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment file

Create a `.env` file in the root directory with the following variables:

```
PORT=5000
MONGO_URI=your_mongo_connection
JWT_SECRET=your_secret_key
```

### 4. Run the server

```bash
npm run dev
```

## API Response Format

### Success

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error

```json
{
  "success": false,
  "message": "Operation failed",
  "errors": []
}
```

## Core Endpoints

### Authentication

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/profile`

### Routes Module

- `GET /routes`

Returns official commuter corridors supported by MoveIQ.

### Incident Reporting

- `POST /incidents`
- `GET /incidents`

Allows users to report:

- Accident
- Roadblock
- Heavy Traffic

### Health Check Endpoint

- `GET /health`

Returns service status.

## Git Workflow

### Branches

- `main`
- `develop`
- `feature/*`

### Workflow

```
feature branch
      ↓
pull request
      ↓
develop
      ↓
main
```

## License

MoveIQ Project
