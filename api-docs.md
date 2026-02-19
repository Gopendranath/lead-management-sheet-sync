# Lead Management System — API Documentation

**Base URL:** `http://localhost:4000/api`

---

## Authentication

This API uses **httpOnly cookie-based authentication**. After a successful login, the server sets a `token` cookie automatically. All subsequent requests to protected endpoints must include this cookie (handled automatically by browsers and tools that support cookie jars).

> **Cookie details:** `token` — httpOnly, secure (in production), sameSite=lax (dev) / none (prod), 7-day expiry.

---

## Endpoints

### Health Check

| Method | Path | Auth | Description |
| ------ | ------------- | ---- | ------------------ |
| GET    | `/api/health` | ❌    | Server health check |

**Response:**

```json
{ "success": true, "message": "Lead Management API is running", "timestamp": "..." }
```

---

### Auth

#### `POST /api/auth/login`

Admin login. Sets an httpOnly `token` cookie. Rate limited to 10 requests per 15 minutes.

**Request Body:**

```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "admin": { "id": "uuid", "email": "admin@example.com" }
  },
  "message": "Login successful"
}
```

**Headers:** Sets `Set-Cookie: token=<jwt>; HttpOnly; Path=/; ...`

**Error Response (401):**

```json
{ "success": false, "error": "Invalid email or password" }
```

---

#### `POST /api/auth/logout`

Clears the auth cookie.

**Success Response (200):**

```json
{
  "success": true,
  "data": null,
  "message": "Logged out successfully"
}
```

---

#### `GET /api/auth/me` 🔒

Get the currently authenticated admin. Requires the `token` cookie.

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "admin": { "id": "uuid", "email": "admin@example.com", "createdAt": "..." }
  }
}
```

**Error Response (401):**

```json
{ "success": false, "error": "Authentication required" }
```

---

### Leads

#### `POST /api/leads`

Create a new lead (public). Rate limited to 5 per hour.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "course": "Web Development",
  "college": "MIT",
  "year": "3rd"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "course": "Web Development",
    "college": "MIT",
    "year": "3rd",
    "status": "NEW",
    "sheetRowId": "2",
    "createdAt": "2026-02-19T..."
  },
  "message": "Lead created successfully"
}
```

**Error Responses:**

| Code | Description        |
| ---- | ------------------ |
| 400  | Validation failed  |
| 409  | Email already exists |
| 429  | Rate limit exceeded |

---

#### `GET /api/leads` 🔒

List leads with search, filter, and pagination. Requires `token` cookie.

**Query Parameters:**

| Param    | Type   | Default | Description              |
| -------- | ------ | ------- | ------------------------ |
| `page`   | number | 1       | Page number              |
| `limit`  | number | 10      | Items per page (max 100) |
| `search` | string | —       | Search in name & email   |
| `course` | string | —       | Filter by course         |
| `status` | enum   | —       | `NEW` or `CONTACTED`     |

**Example:** `GET /api/leads?page=1&limit=10&search=john&course=Web+Development`

**Success Response (200):**

```json
{
  "success": true,
  "data": [ { "id": "...", "name": "...", "..." : "..." } ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

---

#### `GET /api/leads/:id` 🔒

Get a single lead by ID. Requires `token` cookie.

**Success Response (200):**

```json
{
  "success": true,
  "data": { "id": "uuid", "name": "...", "email": "..." }
}
```

**Error Response (404):**

```json
{ "success": false, "error": "Lead not found" }
```

---

#### `PATCH /api/leads/:id/status` 🔒

Update lead status. Requires `token` cookie.

**Request Body:**

```json
{ "status": "CONTACTED" }
```

**Success Response (200):**

```json
{
  "success": true,
  "data": { "id": "uuid", "status": "CONTACTED" },
  "message": "Lead status updated successfully"
}
```

**Error Responses:**

| Code | Description         |
| ---- | ------------------- |
| 400  | Invalid status value |
| 404  | Lead not found      |

---

## Error Format

All errors follow this format:

```json
{
  "success": false,
  "error": "Human-readable error message"
}
```

## Rate Limits

| Endpoint       | Limit        | Window |
| -------------- | ------------ | ------ |
| General        | 100 requests | 15 min |
| Auth login     | 10 requests  | 15 min |
| Lead creation  | 5 requests   | 1 hour |
