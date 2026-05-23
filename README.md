# DevPulse API

DevPulse API is a backend REST API for an internal tech issue and feature tracking system. It allows team members to register, log in, create issues, view issues, and manage issue workflow based on role-based permissions.

---

## Live URL

```txt
your-live-url-here
````

---

## GitHub Repository

```txt
your-github-repository-url-here
```

---

## Features

* User registration with contributor and maintainer roles
* User login with JWT authentication
* Password hashing using bcrypt
* Create bug reports and feature requests
* View all issues
* View single issue details
* Filter issues by type and status
* Sort issues by newest or oldest
* Contributor can update only their own open issues
* Maintainer can update any issue
* Maintainer can delete any issue
* Standard success and error response format
* PostgreSQL database using raw SQL with `pool.query()`
* No ORM, no query builder, and no SQL JOINs

---

## Tech Stack

* Node.js
* TypeScript
* Express.js
* PostgreSQL
* Native `pg` driver
* Raw SQL
* bcrypt
* jsonwebtoken
* dotenv
* cors
* http-status-codes

---

## Setup Steps

### 1. Clone the repository

```bash
git clone your-github-repository-url-here
cd devpulse-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file

Create a `.env` file in the root directory and add:

```env
PORT=5000

CONNECTION_STRING=your_postgresql_connection_string

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

BCRYPT_SALT_ROUNDS=10
```

### 4. Run the project locally

```bash
npm run dev
```

Server will run on:

```txt
http://localhost:5000
```

### 5. Build the project

```bash
npm run build
```

### 6. Start production build

```bash
npm start
```

---

## API Endpoints

### Authentication

| Method | Endpoint           | Access | Description                      |
| ------ | ------------------ | ------ | -------------------------------- |
| POST   | `/api/auth/signup` | Public | Register a new user              |
| POST   | `/api/auth/login`  | Public | Login user and receive JWT token |

### Issues

| Method | Endpoint          | Access          | Description                                  |
| ------ | ----------------- | --------------- | -------------------------------------------- |
| POST   | `/api/issues`     | Protected       | Create a new issue                           |
| GET    | `/api/issues`     | Public          | Get all issues with optional filter and sort |
| GET    | `/api/issues/:id` | Public          | Get a single issue                           |
| PATCH  | `/api/issues/:id` | Protected       | Update an issue                              |
| DELETE | `/api/issues/:id` | Maintainer only | Delete an issue                              |

---

## Query Parameters for Get All Issues

Endpoint:

```http
GET /api/issues
```

Supported query parameters:

| Parameter | Values                            | Default  |
| --------- | --------------------------------- | -------- |
| sort      | `newest`, `oldest`                | `newest` |
| type      | `bug`, `feature_request`          | none     |
| status    | `open`, `in_progress`, `resolved` | none     |

Example:

```http
GET /api/issues?sort=newest&type=bug&status=open
```

---

## Authentication

After login, the API returns a JWT token.

For protected routes, send the token in the request header:

```txt
Authorization: <JWT_TOKEN>
```

No `Bearer` prefix is required.

JWT payload includes:

```json
{
  "id": 1,
  "name": "John Doe",
  "role": "contributor"
}
```

---

## Database Schema Summary

The project uses PostgreSQL with two main tables: `users` and `issues`.

---

### users table

| Field      | Type                | Description           |
| ---------- | ------------------- | --------------------- |
| id         | SERIAL PRIMARY KEY  | Unique user id        |
| name       | VARCHAR(100)        | User full name        |
| email      | VARCHAR(150) UNIQUE | User email            |
| password   | TEXT                | Hashed password       |
| role       | VARCHAR(20)         | User role             |
| created_at | TIMESTAMP           | Account creation time |
| updated_at | TIMESTAMP           | Last update time      |

Allowed roles:

```txt
contributor
maintainer
```

---

### issues table

| Field       | Type               | Description                   |
| ----------- | ------------------ | ----------------------------- |
| id          | SERIAL PRIMARY KEY | Unique issue id               |
| title       | VARCHAR(150)       | Issue title                   |
| description | TEXT               | Issue description             |
| type        | VARCHAR(30)        | Issue type                    |
| status      | VARCHAR(30)        | Issue workflow status         |
| reporter_id | INTEGER            | User id of the issue reporter |
| created_at  | TIMESTAMP          | Issue creation time           |
| updated_at  | TIMESTAMP          | Last update time              |

Allowed issue types:

```txt
bug
feature_request
```

Allowed issue statuses:

```txt
open
in_progress
resolved
```

---

## Standard Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

For public GET requests, the response may contain only `success` and `data`.

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "errors": null
}
```

---

## Important Notes

* Passwords are never returned in API responses.
* Protected routes require a valid JWT token.
* Role verification is done before privileged operations.
* `reporter_id` is extracted from the decoded JWT, not from the request body.
* Raw SQL queries are written using `pool.query()`.
* No ORM or query builder is used.
* No SQL JOIN is used.
* Reporter details are fetched separately and mapped manually in the backend.

---

## Scripts

```json
{
  "dev": "tsx watch ./src/server.ts",
  "build": "tsup",
  "start": "node dist/server.js"
}
```

---

## Author

Hasnath Ahmed Tamim

````

Commit দাও:

```bash
git add README.md
git commit -m "add project readme"
````
