# Students Result Management System - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## Auth Routes

### POST /auth/login
Login for admin or teacher.

**Request Body:**
```json
{
    "username": "admin",
    "password": "admin123",
    "role": "admin"  // or "teacher"
}
```

**Response (200):**
```json
{
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "role": "admin",
    "user": { "id": "...", "username": "admin" }
}
```

### POST /auth/register-teacher
Create a new teacher account (Admin only).

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "department": "Computer Science"
}
```

### GET /auth/me
Get current user info.

**Headers:** `Authorization: Bearer <token>`

---

## Student Routes

### GET /students
Get all students with pagination.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 50) |
| department | string | Filter by department |
| semester | string | Filter by semester |
| session | string | Filter by session |
| search | string | Search by name, roll, or registration no |
| sortBy | string | Sort field (default: createdAt) |
| sortOrder | string | asc or desc (default: desc) |

**Response (200):**
```json
{
    "students": [...],
    "pagination": {
        "page": 1,
        "limit": 50,
        "total": 120,
        "totalPages": 3,
        "hasNext": true,
        "hasPrev": false
    }
}
```

### POST /students
Create a new student.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
    "name": "Student Name",
    "roll": "1001",
    "registrationNo": "REG001",
    "department": "Computer Science",
    "semester": "1st",
    "session": "2024-2025",
    "email": "student@example.com",
    "phone": "01700000000"
}
```

### PUT /students/:id
Update a student.

### DELETE /students/:id
Delete a student.

---

## Result Routes

### GET /results
Get all results with pagination.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| page | number | Page number |
| limit | number | Items per page |
| semester | string | Filter by semester |
| status | string | Filter by status (Passed/Failed/Referred) |
| minCgpa | number | Minimum CGPA |
| maxCgpa | number | Maximum CGPA |

### POST /results
Create a new result.

**Request Body:**
```json
{
    "studentId": "mongo_object_id",
    "semester": "1st",
    "subjects": [
        { "subjectName": "Math", "marks": 85, "credits": 4 },
        { "subjectName": "Physics", "marks": 78, "credits": 3 }
    ]
}
```

### GET /results/search?roll=1001
Public search by roll number.

### PUT /results/:id
Update a result.

### DELETE /results/:id
Delete a result.

---

## Bulk Upload Routes

### POST /bulk/upload-results
Upload results from Excel/CSV file.

**Headers:** `Authorization: Bearer <token>`
**Content-Type:** `multipart/form-data`

**Form Data:**
- `file`: Excel or CSV file

---

## Error Responses

All errors follow this format:
```json
{
    "message": "Error description",
    "code": "ERROR_CODE"
}
```

**Common Error Codes:**
| Code | Status | Description |
|------|--------|-------------|
| NO_TOKEN | 401 | No auth token provided |
| TOKEN_EXPIRED | 401 | JWT token has expired |
| INVALID_TOKEN | 401 | Invalid JWT token |
| FORBIDDEN | 403 | Access denied |
| ADMIN_ONLY | 403 | Admin access required |
| NOT_FOUND | 404 | Resource not found |
| VALIDATION_ERROR | 400 | Input validation failed |

---

## Rate Limits

| Route Pattern | Limit | Window |
|---------------|-------|--------|
| /api/* | 500 requests | 15 minutes |
| /auth/login | 10 attempts | 15 minutes |

---

## CORS

Allowed origins:
- http://localhost:5173
- http://localhost:3000
- http://127.0.0.1:5173
