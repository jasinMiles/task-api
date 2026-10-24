# Task Management API

A RESTful API for managing personal tasks, built with Node.js, Express.js, and MongoDB. It supports user registration, secure authentication with JSON Web Tokens (JWT), and task management with user-specific access control.

## Live Demo

- **Live API:** https://task-api-nbe4.onrender.com
- **Interactive API Documentation:** https://task-api-nbe4.onrender.com/api-docs
- **GitHub Repository:** https://github.com/jasinMiles/task-api

## Features

- User registration and login.
- Password hashing using bcrypt.
- JWT-based authentication.
- Create, retrieve, update, and delete tasks.
- Retrieve all tasks belonging to the authenticated user.
- User-specific task ownership and access control.
- Request validation and structured error responses.
- Interactive API documentation with Swagger UI.
- MongoDB Atlas database integration.
- Production deployment on Render.

## Technologies Used

- **Node.js** — JavaScript runtime.
- **Express.js** — Web application framework.
- **MongoDB Atlas** — Cloud database.
- **Mongoose** — MongoDB object modeling.
- **bcryptjs** — Password hashing.
- **jsonwebtoken** — JWT generation and verification.
- **express-validator** — Request validation.
- **Swagger UI Express** and **swagger-jsdoc** — API documentation.
- **dotenv** — Environment variable management.
- **Render** — Deployment and hosting.

## Getting Started

### Prerequisites

Before running the project locally, ensure you have:

- Node.js and npm installed.
- A MongoDB Atlas account or an accessible MongoDB instance.
- Git installed.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/jasinMiles/task-api.git
   ```

2. Navigate into the project directory:

   ```bash
   cd task-api
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the project root and configure the following variables:

   ```env
   PORT=5001
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secure_jwt_secret
   ```

   Replace the placeholder values with your own configuration. Never commit your actual `.env` file or expose your database credentials or JWT secret.

5. Start the application:

   ```bash
   npm start
   ```

The API should start on the configured port. When the database connection succeeds, the application logs a MongoDB connection confirmation.

### Verify the Application

- Health check: `http://localhost:5001/health`
- API root: `http://localhost:5001/`
- Swagger documentation: `http://localhost:5001/api-docs`

For the deployed version, use the live links in the **Live Demo** section.

## API Endpoints

Base URL: `https://task-api-nbe4.onrender.com`

### Health and General

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| GET | `/health` | Check API health | Not required |
| GET | `/` | Check API availability | Not required |

### Authentication

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | Not required |
| POST | `/api/auth/login` | Authenticate a user and obtain a JWT | Not required |

### Tasks

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| POST | `/api/tasks` | Create a task | Required |
| GET | `/api/tasks` | Retrieve the authenticated user's tasks | Required |
| GET | `/api/tasks/:id` | Retrieve a task by ID | Required |
| PUT | `/api/tasks/:id` | Update a task | Required |
| DELETE | `/api/tasks/:id` | Delete a task | Required |

## Authentication

The API uses JSON Web Tokens (JWT) to protect task endpoints.

### 1. Register a User

**POST** `/api/auth/register`

Request body:

```json
{
  "name": "Demo User",
  "email": "demo@example.com",
  "password": "YourStrongPassword123!"
}
```

A successful registration returns the user's safe details without exposing the password.

### 2. Log In

**POST** `/api/auth/login`

Request body:

```json
{
  "email": "demo@example.com",
  "password": "YourStrongPassword123!"
}
```

A successful login returns a JWT token and user details.

### 3. Access Protected Endpoints

Include the JWT token in the HTTP `Authorization` header:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

Replace `YOUR_JWT_TOKEN` with the token returned by the login endpoint.

Tokens expire according to the configured JWT expiration period.

## Task Management

### Create a Task

**POST** `/api/tasks`

Request body:

```json
{
  "title": "Learn Express.js",
  "description": "Build and test REST API endpoints",
  "status": "pending"
}
```

### Task Status Values

The supported task statuses are:

- `pending`
- `in-progress`
- `completed`

If a status is omitted during task creation, the default is `pending`.

### Task Data Structure

A task contains the following fields:

| Field | Description |
|---|---|
| `title` | Task title; required |
| `description` | Task description; required |
| `status` | Task status; restricted to supported values |
| `user` | Reference to the owning user |
| `createdAt` | Task creation timestamp |

MongoDB also assigns each task a unique `_id`.

## Security and Validation

- Passwords are hashed before storage.
- Passwords are not returned in normal registration or login responses.
- Protected endpoints require a valid JWT.
- Task queries are scoped to the authenticated user to prevent access to other users' tasks.
- Input validation checks required task fields and supported status values.
- Environment variables are used for sensitive configuration.

## Error Handling

The API uses HTTP status codes to communicate the result of a request. Common responses include:

| Status Code | Meaning |
|---|---|
| `200 OK` | Request completed successfully |
| `201 Created` | Resource created successfully |
| `400 Bad Request` | Invalid input or request data |
| `401 Unauthorized` | Missing, invalid, or expired authentication token |
| `404 Not Found` | Requested task not found or not accessible to the user |
| `500 Internal Server Error` | Unexpected server-side error |

## API Documentation

Swagger UI provides interactive documentation for the API endpoints, request bodies, response codes, and authentication.

Open the live documentation:

**https://task-api-nbe4.onrender.com/api-docs**

You can use the documentation to register a user, log in, authorize requests with a JWT, and test task operations.

## Deployment

The application is deployed on Render and uses MongoDB Atlas for cloud database storage.

- **Production API:** https://task-api-nbe4.onrender.com
- **Production API Documentation:** https://task-api-nbe4.onrender.com/api-docs

Render's free service may spin down after inactivity, so the first request after a period without traffic may take longer to respond.

## Future Improvements

Potential enhancements include:

- Automated unit and integration tests.
- Pagination and sorting for task lists.
- More comprehensive API validation and error handling.
- Rate limiting and additional security controls.
- Continuous integration and deployment.

## Author

**Michael Avwerosuo Okeme**

Computer Science Graduate | Software Development

GitHub: https://github.com/jasinMiles

---

This project was developed as a practical exercise in REST API development, authentication, database integration, API documentation, and cloud deployment.
