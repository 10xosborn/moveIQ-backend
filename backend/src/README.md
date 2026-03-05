MoveIQ Backend API

MoveIQ is a backend API that supports a traffic and incident reporting system. The purpose of this backend service is to allow users to create accounts, authenticate securely, and report incidents such as traffic congestion, roadblocks, or accidents. The system stores user information and incident reports in a MongoDB database and exposes RESTful API endpoints that can be accessed by a frontend application or tested using tools such as Postman or Thunder Client.

The backend is built using Node.js and Express, with MongoDB Atlas used as the database. Authentication is implemented using JSON Web Tokens (JWT), and user passwords are securely stored using bcrypt hashing. Security middleware such as Helmet and CORS are used to protect the application, while Morgan is used for logging HTTP requests during development.

The backend currently supports the following core functionality: user registration, user login, retrieving authenticated user information, reporting incidents, and retrieving reported incidents. These features form the foundation of the MoveIQ reporting system.

Technologies used in this project include Node.js, Express.js, MongoDB Atlas, Mongoose, JSON Web Tokens (JWT) for authentication, bcryptjs for password hashing, dotenv for environment variable management, helmet for security headers, cors for cross-origin resource sharing, morgan for request logging, and nodemon for development server auto-restart.

To run this project locally, first clone the repository from GitHub. After cloning the repository, navigate to the backend directory and install all required dependencies using npm. Once dependencies are installed, create an environment file to store configuration variables such as the server port, MongoDB connection string, and JWT secret key.

Example environment configuration:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

After setting up the environment variables, start the development server using the command:

npm run dev

For production environments, the server can be started using:

npm start

Once the server starts successfully, it will run on:

http://localhost:5000

To confirm the server is running, open a browser or API client and send a request to the root endpoint.

GET /

The response should return:

{
"success": true,
"message": "MoveIQ API is running"
}

Authentication in this API is handled using JSON Web Tokens. When a user logs in successfully, a token is generated and returned in the response. This token must be included in the Authorization header when accessing protected routes.

Example Authorization header:

Authorization: Bearer YOUR_JWT_TOKEN

API Endpoints

User Registration
Endpoint: POST /api/auth/register

Request body:

{
"name": "Elizabeth",
"email": "elizabeth@test.com
",
"password": "password123"
}

This endpoint creates a new user account and stores the user details securely in the database.

User Login
Endpoint: POST /api/auth/login

Request body:

{
"email": "elizabeth@test.com
",
"password": "password123"
}

If authentication is successful, the server returns a JWT token that can be used to access protected routes.

Get Current User
Endpoint: GET /api/auth/me

Headers required:

Authorization: Bearer JWT_TOKEN

This endpoint returns information about the currently authenticated user.

Create Incident Report
Endpoint: POST /api/incidents

Headers required:

Authorization: Bearer JWT_TOKEN

Request body example:

{
"type": "Roadblock",
"latitude": 6.5244,
"longitude": 3.3792
}

This endpoint allows authenticated users to report incidents with location coordinates.

Get All Incidents
Endpoint: GET /api/incidents

Headers required:

Authorization: Bearer JWT_TOKEN

This endpoint returns all recorded incident reports stored in the database.

To test the API, tools such as Postman, Thunder Client, or any REST API testing client can be used. The typical testing flow begins by registering a user account, then logging in to obtain a JWT token. After receiving the token, the Authorization header should be added to requests when accessing protected endpoints such as creating or retrieving incidents.

Once the backend is connected to MongoDB Atlas and running successfully, the database collections will automatically appear in the cluster when users register or incidents are created. These collections can be viewed in MongoDB Atlas under the database collections browser.

This backend service was developed as part of the MoveIQ system and provides the foundational API required for user authentication and incident reporting.
All endpoints in this backend

POST /api/auth/register

POST /api/auth/login

GET /api/auth/me

POST /api/incidents

GET /api/incidents

GET /api/incidents