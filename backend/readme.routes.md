# 📚 Placement Drive API - Routes Documentation

Complete guide to all API endpoints with request/response examples for testing in Postman.

---

## 🔑 Authentication & Cookies Guide

### How Tokens Work
- **Token Type:** JWT (JSON Web Token)
- **Token Duration:** 7 days
- **Token Storage:** Sent in response → Store in variable or manually add to headers
- **Cookie Handling:** CORS enabled with `credentials: true` (cookies are automatically sent)

### How to Send Token in Postman
1. After login/register, copy the token from response
2. Go to **Headers** tab
3. Add new header:
   - **Key:** `Authorization`
   - **Value:** `Bearer YOUR_TOKEN_HERE`
4. Replace `YOUR_TOKEN_HERE` with actual token

### Example Token Response
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "student"
}
```

---

## 🏠 Base URL
```
http://localhost:5000/api
```

---

## 🔐 AUTH Routes

### 1. **Register Student**
- **Endpoint:** `POST /auth/register`
- **Authentication:** ❌ Not Required
- **User Type:** Public (Anyone)

#### Request Body
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Postman Steps
1. Set method to **POST**
2. URL: `http://localhost:5000/api/auth/register`
3. Go to **Body** → Select **raw** → Choose **JSON**
4. Paste request body above
5. Click **Send**

---

### 2. **Login User**
- **Endpoint:** `POST /auth/login`
- **Authentication:** ❌ Not Required
- **User Type:** Public (Student/Recruiter/Admin)

#### Request Body
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "student"
}
```

#### Postman Steps
1. Set method to **POST**
2. URL: `http://localhost:5000/api/auth/login`
3. Body → raw → JSON
4. Paste request body above
5. Click **Send**
6. **Copy the token** from response for future requests

---

### 3. **Create Recruiter** (Admin Only)
- **Endpoint:** `POST /auth/create-recruiter`
- **Authentication:** ✅ Required (Admin only)
- **User Type:** Admin

#### Request Headers
```
Authorization: Bearer {admin_token}
```

#### Request Body
```json
{
  "name": "Sarah Johnson",
  "email": "sarah.recruiter@company.com",
  "password": "securepass123"
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "recruiter": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Sarah Johnson",
    "email": "sarah.recruiter@company.com",
    "role": "recruiter",
    "isActive": true,
    "createdAt": "2024-02-14T10:30:00.000Z",
    "updatedAt": "2024-02-14T10:30:00.000Z"
  }
}
```

#### Postman Steps
1. Set method to **POST**
2. URL: `http://localhost:5000/api/auth/create-recruiter`
3. Headers → Add `Authorization: Bearer {admin_token}`
4. Body → raw → JSON → Paste request body
5. Click **Send**

---

### 4. **Create Admin** (Admin Only)
- **Endpoint:** `POST /auth/create-admin`
- **Authentication:** ✅ Required (Admin only)
- **User Type:** Admin

#### Request Headers
```
Authorization: Bearer {admin_token}
```

#### Request Body
```json
{
  "name": "Admin User",
  "email": "admin@placement.com",
  "password": "adminpass123"
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "admin": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Admin User",
    "email": "admin@placement.com",
    "role": "admin",
    "isActive": true,
    "createdAt": "2024-02-14T10:35:00.000Z",
    "updatedAt": "2024-02-14T10:35:00.000Z"
  }
}
```

---

---

## 👨‍🎓 STUDENT Routes

### 1. **Get Profile**
- **Endpoint:** `GET /students/profile`
- **Authentication:** ✅ Required (Student only)
- **User Type:** Student

#### Request Headers
```
Authorization: Bearer {student_token}
```

#### Response (200 OK)
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "user": "507f1f77bcf86cd799439010",
  "phone": "9876543210",
  "course": "BTech",
  "college": "IIT Delhi",
  "year": 4,
  "skills": ["Java", "Python", "React"],
  "resume": {
    "url": "https://imagekit.io/file/placement-resumes/resume-1707900000000.pdf",
    "fileId": "fileId123"
  },
  "createdAt": "2024-02-10T10:30:00.000Z",
  "updatedAt": "2024-02-14T10:30:00.000Z"
}
```

#### Postman Steps
1. Set method to **GET**
2. URL: `http://localhost:5000/api/students/profile`
3. Headers → Add `Authorization: Bearer {student_token}`
4. Click **Send**

---

### 2. **Update Profile**
- **Endpoint:** `PUT /students/profile`
- **Authentication:** ✅ Required (Student only)
- **User Type:** Student

#### Request Headers
```
Authorization: Bearer {student_token}
```

#### Request Body
```json
{
  "phone": "9876543210",
  "course": "BTech CS",
  "college": "IIT Delhi",
  "year": 4,
  "skills": ["Java", "Python", "React", "Node.js"]
}
```

#### Response (200 OK)
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "user": "507f1f77bcf86cd799439010",
  "phone": "9876543210",
  "course": "BTech CS",
  "college": "IIT Delhi",
  "year": 4,
  "skills": ["Java", "Python", "React", "Node.js"],
  "resume": {
    "url": "https://imagekit.io/file/placement-resumes/resume-1707900000000.pdf",
    "fileId": "fileId123"
  },
  "updatedAt": "2024-02-14T11:30:00.000Z"
}
```

#### Postman Steps
1. Set method to **PUT**
2. URL: `http://localhost:5000/api/students/profile`
3. Headers → Add `Authorization: Bearer {student_token}`
4. Body → raw → JSON → Paste request body
5. Click **Send**

---

### 3. **Upload Resume** ⬆️
- **Endpoint:** `POST /students/upload-resume`
- **Authentication:** ✅ Required (Student only)
- **User Type:** Student
- **File Format:** PDF only
- **File Size Limit:** 5 MB max
- **Upload Service:** ImageKit (Stores in `/placement-resumes` folder)

#### Request Headers
```
Authorization: Bearer {student_token}
Content-Type: multipart/form-data
```

#### Request Body (Form-data)
| Key | Type | Value |
|-----|------|-------|
| resume | File | Select PDF file from your computer |

#### Response (200 OK)
```json
{
  "success": true,
  "resume": {
    "url": "https://imagekit.io/file/placement-resumes/resume-1707900000000.pdf",
    "fileId": "507f1f77bcf86cd799439014"
  }
}
```

#### Postman Steps
1. Set method to **POST**
2. URL: `http://localhost:5000/api/students/upload-resume`
3. Headers → Add `Authorization: Bearer {student_token}`
4. Body → Select **form-data** (not raw)
5. In Key column type: `resume`
6. In Value section: Click on dropdown, select **File**
7. Click **Select Files** and choose your PDF resume
8. Click **Send**

#### Notes
- Must be PDF format
- Maximum file size: 5 MB
- File is stored with name: `resume-{timestamp}.pdf`
- ImageKit provides CDN URL for fast downloads

---

### 4. **Get Active Drives**
- **Endpoint:** `GET /students/drives`
- **Authentication:** ✅ Required (Student only)
- **User Type:** Student

#### Request Headers
```
Authorization: Bearer {student_token}
```

#### Response (200 OK)
```json
[
  {
    "_id": "507f1f77bcf86cd799439015",
    "jobRole": "Software Engineer",
    "company": {
      "_id": "507f1f77bcf86cd799439020",
      "name": "Tech Corp",
      "location": "Bangalore"
    },
    "salary": "12 LPA",
    "deadline": "2024-02-28T23:59:59.000Z",
    "isActive": true,
    "createdAt": "2024-02-10T10:30:00.000Z"
  }
]
```

#### Postman Steps
1. Set method to **GET**
2. URL: `http://localhost:5000/api/students/drives`
3. Headers → Add `Authorization: Bearer {student_token}`
4. Click **Send**

---

### 5. **Apply to Drive**
- **Endpoint:** `POST /students/apply/:driveId`
- **Authentication:** ✅ Required (Student only)
- **User Type:** Student

#### Request Headers
```
Authorization: Bearer {student_token}
```

#### URL Parameter
```
:driveId = 507f1f77bcf86cd799439015
```

#### Full URL Example
```
http://localhost:5000/api/students/apply/507f1f77bcf86cd799439015
```

#### Request Body
```json
{}
```
(Empty body - driveId is in URL)

#### Response (201 Created)
```json
{
  "_id": "507f1f77bcf86cd799439025",
  "student": "507f1f77bcf86cd799439010",
  "drive": "507f1f77bcf86cd799439015",
  "company": "507f1f77bcf86cd799439020",
  "status": "Applied",
  "currentRound": 0,
  "attendance": false,
  "rating": 0,
  "recruiterNotes": "",
  "finalStage": false,
  "rounds": [],
  "createdAt": "2024-02-14T12:00:00.000Z"
}
```

#### Error Responses
```json
{
  "message": "Drive not found"
}
```

```json
{
  "message": "Drive is not active"
}
```

```json
{
  "message": "Application deadline has passed"
}
```

```json
{
  "message": "You have already applied to this drive"
}
```

```json
{
  "message": "Please complete your profile with phone, course, college, and resume before applying"
}
```

#### Postman Steps
1. Set method to **POST**
2. URL: `http://localhost:5000/api/students/apply/507f1f77bcf86cd799439015`
3. Headers → Add `Authorization: Bearer {student_token}`
4. Body → raw → JSON → `{}`
5. Click **Send**

#### Prerequisites
- Student profile must be complete (phone, course, college, resume)
- Drive must be active
- Deadline must not have passed
- Cannot apply twice to same drive

---

### 6. **Get My Applications**
- **Endpoint:** `GET /students/applications`
- **Authentication:** ✅ Required (Student only)
- **User Type:** Student

#### Request Headers
```
Authorization: Bearer {student_token}
```

#### Response (200 OK)
```json
[
  {
    "_id": "507f1f77bcf86cd799439025",
    "student": "507f1f77bcf86cd799439010",
    "drive": {
      "_id": "507f1f77bcf86cd799439015",
      "jobRole": "Software Engineer",
      "salary": "12 LPA"
    },
    "company": {
      "_id": "507f1f77bcf86cd799439020",
      "name": "Tech Corp"
    },
    "status": "Shortlisted",
    "currentRound": 1,
    "attendance": true,
    "rating": 4,
    "createdAt": "2024-02-14T12:00:00.000Z"
  }
]
```

#### Postman Steps
1. Set method to **GET**
2. URL: `http://localhost:5000/api/students/applications`
3. Headers → Add `Authorization: Bearer {student_token}`
4. Click **Send**

---

---

## 🏢 COMPANY Routes

All company routes require **Admin** authentication.

### 1. **Create Company**
- **Endpoint:** `POST /companies/`
- **Authentication:** ✅ Required (Admin only)
- **User Type:** Admin

#### Request Headers
```
Authorization: Bearer {admin_token}
```

#### Request Body
```json
{
  "name": "Tech Corp India",
  "location": "Bangalore",
  "email": "hr@techcorp.com",
  "website": "www.techcorp.com",
  "about": "Leading global tech company"
}
```

#### Response (201 Created)
```json
{
  "_id": "507f1f77bcf86cd799439020",
  "name": "Tech Corp India",
  "location": "Bangalore",
  "email": "hr@techcorp.com",
  "website": "www.techcorp.com",
  "about": "Leading global tech company",
  "recruiters": [],
  "createdBy": "507f1f77bcf86cd799439001",
  "createdAt": "2024-02-14T12:00:00.000Z"
}
```

#### Postman Steps
1. Set method to **POST**
2. URL: `http://localhost:5000/api/companies/`
3. Headers → Add `Authorization: Bearer {admin_token}`
4. Body → raw → JSON → Paste request body
5. Click **Send**

---

### 2. **Get All Companies**
- **Endpoint:** `GET /companies/`
- **Authentication:** ✅ Required (Admin only)
- **User Type:** Admin

#### Request Headers
```
Authorization: Bearer {admin_token}
```

#### Response (200 OK)
```json
[
  {
    "_id": "507f1f77bcf86cd799439020",
    "name": "Tech Corp India",
    "location": "Bangalore",
    "email": "hr@techcorp.com",
    "recruiters": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Sarah Johnson",
        "email": "sarah.recruiter@company.com"
      }
    ],
    "createdAt": "2024-02-14T12:00:00.000Z"
  }
]
```

#### Postman Steps
1. Set method to **GET**
2. URL: `http://localhost:5000/api/companies/`
3. Headers → Add `Authorization: Bearer {admin_token}`
4. Click **Send**

---

### 3. **Get Single Company**
- **Endpoint:** `GET /companies/:id`
- **Authentication:** ✅ Required (Admin only)
- **User Type:** Admin

#### Request Headers
```
Authorization: Bearer {admin_token}
```

#### URL Parameter
```
:id = 507f1f77bcf86cd799439020
```

#### Response (200 OK)
```json
{
  "_id": "507f1f77bcf86cd799439020",
  "name": "Tech Corp India",
  "location": "Bangalore",
  "email": "hr@techcorp.com",
  "website": "www.techcorp.com",
  "about": "Leading global tech company",
  "recruiters": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Sarah Johnson",
      "email": "sarah.recruiter@company.com",
      "role": "recruiter"
    }
  ]
}
```

#### Postman Steps
1. Set method to **GET**
2. URL: `http://localhost:5000/api/companies/507f1f77bcf86cd799439020`
3. Headers → Add `Authorization: Bearer {admin_token}`
4. Click **Send**

---

### 4. **Update Company**
- **Endpoint:** `PUT /companies/:id`
- **Authentication:** ✅ Required (Admin only)
- **User Type:** Admin

#### Request Headers
```
Authorization: Bearer {admin_token}
```

#### Request Body
```json
{
  "name": "Tech Corp Global",
  "location": "Bangalore, Pune",
  "about": "Expanded operations"
}
```

#### Response (200 OK)
```json
{
  "_id": "507f1f77bcf86cd799439020",
  "name": "Tech Corp Global",
  "location": "Bangalore, Pune",
  "email": "hr@techcorp.com",
  "website": "www.techcorp.com",
  "about": "Expanded operations",
  "recruiters": [],
  "updatedAt": "2024-02-14T12:30:00.000Z"
}
```

#### Postman Steps
1. Set method to **PUT**
2. URL: `http://localhost:5000/api/companies/507f1f77bcf86cd799439020`
3. Headers → Add `Authorization: Bearer {admin_token}`
4. Body → raw → JSON → Paste request body
5. Click **Send**

---

### 5. **Delete Company**
- **Endpoint:** `DELETE /companies/:id`
- **Authentication:** ✅ Required (Admin only)
- **User Type:** Admin

#### Request Headers
```
Authorization: Bearer {admin_token}
```

#### Response (200 OK)
```json
{
  "success": true
}
```

#### Postman Steps
1. Set method to **DELETE**
2. URL: `http://localhost:5000/api/companies/507f1f77bcf86cd799439020`
3. Headers → Add `Authorization: Bearer {admin_token}`
4. Click **Send**

---

### 6. **Assign Recruiter to Company**
- **Endpoint:** `POST /companies/:companyId/assign-recruiter`
- **Authentication:** ✅ Required (Admin only)
- **User Type:** Admin

#### Request Headers
```
Authorization: Bearer {admin_token}
```

#### URL Parameter
```
:companyId = 507f1f77bcf86cd799439020
```

#### Request Body
```json
{
  "recruiterId": "507f1f77bcf86cd799439011"
}
```

#### Response (200 OK)
```json
{
  "_id": "507f1f77bcf86cd799439020",
  "name": "Tech Corp India",
  "location": "Bangalore",
  "recruiters": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Sarah Johnson",
      "email": "sarah.recruiter@company.com"
    }
  ]
}
```

#### Postman Steps
1. Set method to **POST**
2. URL: `http://localhost:5000/api/companies/507f1f77bcf86cd799439020/assign-recruiter`
3. Headers → Add `Authorization: Bearer {admin_token}`
4. Body → raw → JSON → Paste request body
5. Click **Send**

---

### 7. **Remove Recruiter from Company**
- **Endpoint:** `POST /companies/:companyId/remove-recruiter`
- **Authentication:** ✅ Required (Admin only)
- **User Type:** Admin

#### Request Headers
```
Authorization: Bearer {admin_token}
```

#### Request Body
```json
{
  "recruiterId": "507f1f77bcf86cd799439011"
}
```

#### Response (200 OK)
```json
{
  "_id": "507f1f77bcf86cd799439020",
  "name": "Tech Corp India",
  "recruiters": []
}
```

#### Postman Steps
1. Set method to **POST**
2. URL: `http://localhost:5000/api/companies/507f1f77bcf86cd799439020/remove-recruiter`
3. Headers → Add `Authorization: Bearer {admin_token}`
4. Body → raw → JSON → Paste request body
5. Click **Send**

---

---

## 📋 DRIVE Routes

### 1. **Get All Drives** (Public)
- **Endpoint:** `GET /drives/`
- **Authentication:** ❌ Not Required
- **User Type:** Public

#### Response (200 OK)
```json
[
  {
    "_id": "507f1f77bcf86cd799439015",
    "jobRole": "Software Engineer",
    "company": {
      "_id": "507f1f77bcf86cd799439020",
      "name": "Tech Corp India"
    },
    "salary": "12 LPA",
    "location": "Bangalore",
    "deadline": "2024-02-28T23:59:59.000Z",
    "isActive": true,
    "description": "Looking for talented backend engineers"
  }
]
```

#### Postman Steps
1. Set method to **GET**
2. URL: `http://localhost:5000/api/drives/`
3. Click **Send** (No auth needed)

---

### 2. **Get Drive by ID** (Public)
- **Endpoint:** `GET /drives/:id`
- **Authentication:** ❌ Not Required
- **User Type:** Public

#### URL Parameter
```
:id = 507f1f77bcf86cd799439015
```

#### Response (200 OK)
```json
{
  "_id": "507f1f77bcf86cd799439015",
  "jobRole": "Software Engineer",
  "company": {
    "_id": "507f1f77bcf86cd799439020",
    "name": "Tech Corp India",
    "location": "Bangalore"
  },
  "salary": "12 LPA",
  "location": "Bangalore",
  "deadline": "2024-02-28T23:59:59.000Z",
  "isActive": true,
  "description": "Looking for talented backend engineers",
  "eligibility": "CGPA >= 7.0",
  "requiredSkills": ["Java", "Spring Boot", "SQL"]
}
```

#### Postman Steps
1. Set method to **GET**
2. URL: `http://localhost:5000/api/drives/507f1f77bcf86cd799439015`
3. Click **Send**

---

### 3. **Create Drive** (Admin Only)
- **Endpoint:** `POST /drives/`
- **Authentication:** ✅ Required (Admin only)
- **User Type:** Admin

#### Request Headers
```
Authorization: Bearer {admin_token}
```

#### Request Body
```json
{
  "jobRole": "Data Scientist",
  "company": "507f1f77bcf86cd799439020",
  "salary": "15 LPA",
  "location": "Bangalore",
  "deadline": "2024-03-15T23:59:59.000Z",
  "isActive": true,
  "description": "Hiring data scientists for AI/ML projects",
  "eligibility": "CGPA >= 7.5",
  "requiredSkills": ["Python", "Machine Learning", "SQL"]
}
```

#### Response (201 Created)
```json
{
  "_id": "507f1f77bcf86cd799439025",
  "jobRole": "Data Scientist",
  "company": "507f1f77bcf86cd799439020",
  "salary": "15 LPA",
  "location": "Bangalore",
  "deadline": "2024-03-15T23:59:59.000Z",
  "isActive": true,
  "description": "Hiring data scientists for AI/ML projects",
  "eligibility": "CGPA >= 7.5",
  "requiredSkills": ["Python", "Machine Learning", "SQL"],
  "createdBy": "507f1f77bcf86cd799439001",
  "createdAt": "2024-02-14T12:00:00.000Z"
}
```

#### Postman Steps
1. Set method to **POST**
2. URL: `http://localhost:5000/api/drives/`
3. Headers → Add `Authorization: Bearer {admin_token}`
4. Body → raw → JSON → Paste request body
5. Click **Send**

---

### 4. **Update Drive** (Admin Only)
- **Endpoint:** `PUT /drives/:id`
- **Authentication:** ✅ Required (Admin only)
- **User Type:** Admin

#### Request Headers
```
Authorization: Bearer {admin_token}
```

#### Request Body
```json
{
  "salary": "16 LPA",
  "deadline": "2024-03-20T23:59:59.000Z",
  "isActive": false
}
```

#### Response (200 OK)
```json
{
  "_id": "507f1f77bcf86cd799439025",
  "jobRole": "Data Scientist",
  "salary": "16 LPA",
  "deadline": "2024-03-20T23:59:59.000Z",
  "isActive": false,
  "updatedAt": "2024-02-14T12:30:00.000Z"
}
```

#### Postman Steps
1. Set method to **PUT**
2. URL: `http://localhost:5000/api/drives/507f1f77bcf86cd799439025`
3. Headers → Add `Authorization: Bearer {admin_token}`
4. Body → raw → JSON → Paste request body
5. Click **Send**

---

### 5. **Delete Drive** (Admin Only)
- **Endpoint:** `DELETE /drives/:id`
- **Authentication:** ✅ Required (Admin only)
- **User Type:** Admin

#### Request Headers
```
Authorization: Bearer {admin_token}
```

#### Response (200 OK)
```json
{
  "success": true
}
```

#### Postman Steps
1. Set method to **DELETE**
2. URL: `http://localhost:5000/api/drives/507f1f77bcf86cd799439025`
3. Headers → Add `Authorization: Bearer {admin_token}`
4. Click **Send**

---

### 6. **Get Company Drives** (Recruiter)
- **Endpoint:** `GET /drives/company/:companyId`
- **Authentication:** ✅ Required (Recruiter)
- **User Type:** Recruiter assigned to company

#### Request Headers
```
Authorization: Bearer {recruiter_token}
```

#### Response (200 OK)
```json
[
  {
    "_id": "507f1f77bcf86cd799439015",
    "jobRole": "Software Engineer",
    "salary": "12 LPA",
    "deadline": "2024-02-28T23:59:59.000Z",
    "isActive": true
  }
]
```

#### Postman Steps
1. Set method to **GET**
2. URL: `http://localhost:5000/api/drives/company/507f1f77bcf86cd799439020`
3. Headers → Add `Authorization: Bearer {recruiter_token}`
4. Click **Send**

---

### 7. **Get My Drives** (Recruiter)
- **Endpoint:** `GET /drives/my/drives`
- **Authentication:** ✅ Required (Recruiter)
- **User Type:** Recruiter

#### Request Headers
```
Authorization: Bearer {recruiter_token}
```

#### Response (200 OK)
```json
[
  {
    "_id": "507f1f77bcf86cd799439015",
    "jobRole": "Software Engineer",
    "company": {
      "_id": "507f1f77bcf86cd799439020",
      "name": "Tech Corp India"
    },
    "salary": "12 LPA",
    "deadline": "2024-02-28T23:59:59.000Z"
  }
]
```

#### Postman Steps
1. Set method to **GET**
2. URL: `http://localhost:5000/api/drives/my/drives`
3. Headers → Add `Authorization: Bearer {recruiter_token}`
4. Click **Send**

---

---

## 📋 APPLICATION Routes

### 1. **Get All Applications** (Admin)
- **Endpoint:** `GET /applications/`
- **Authentication:** ✅ Required (Admin only)
- **User Type:** Admin

#### Request Headers
```
Authorization: Bearer {admin_token}
```

#### Query Parameters (Optional)
```
?status=Applied&company=507f1f77bcf86cd799439020&jobRole=Software%20Engineer
?dateFrom=2024-02-01&dateTo=2024-02-28
```

| Parameter | Type | Example |
|-----------|------|---------|
| status | String | Applied, Rejected, Shortlisted, Selected |
| company | String | Company ID |
| jobRole | String | Software Engineer |
| dateFrom | Date | 2024-02-01 |
| dateTo | Date | 2024-02-28 |

#### Response (200 OK)
```json
[
  {
    "_id": "507f1f77bcf86cd799439025",
    "student": {
      "_id": "507f1f77bcf86cd799439010",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "drive": {
      "_id": "507f1f77bcf86cd799439015",
      "jobRole": "Software Engineer"
    },
    "company": {
      "_id": "507f1f77bcf86cd799439020",
      "name": "Tech Corp India"
    },
    "status": "Shortlisted",
    "currentRound": 1,
    "attendance": true,
    "rating": 4,
    "createdAt": "2024-02-14T12:00:00.000Z"
  }
]
```

#### Postman Steps
1. Set method to **GET**
2. URL: `http://localhost:5000/api/applications/?status=Shortlisted`
3. Headers → Add `Authorization: Bearer {admin_token}`
4. Click **Send**

---

### 2. **Get Application Details**
- **Endpoint:** `GET /applications/:id`
- **Authentication:** ✅ Required (Student/Recruiter/Admin)
- **User Type:** Any authenticated user
- **Access:** Student can only see own, Recruiter/Admin can see all

#### Request Headers
```
Authorization: Bearer {token}
```

#### Response (200 OK)
```json
{
  "_id": "507f1f77bcf86cd799439025",
  "student": {
    "_id": "507f1f77bcf86cd799439010",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210"
  },
  "drive": {
    "_id": "507f1f77bcf86cd799439015",
    "jobRole": "Software Engineer",
    "salary": "12 LPA"
  },
  "company": {
    "_id": "507f1f77bcf86cd799439020",
    "name": "Tech Corp India"
  },
  "status": "Shortlisted",
  "currentRound": 1,
  "attendance": true,
  "rating": 4,
  "recruiterNotes": "Good coding skills",
  "rounds": [
    {
      "name": "Technical Round",
      "date": "2024-02-20T14:00:00.000Z",
      "attendance": true
    }
  ]
}
```

#### Postman Steps
1. Set method to **GET**
2. URL: `http://localhost:5000/api/applications/507f1f77bcf86cd799439025`
3. Headers → Add `Authorization: Bearer {token}`
4. Click **Send**

---

### 3. **Get Drive Applications** (Recruiter)
- **Endpoint:** `GET /applications/drive/:driveId`
- **Authentication:** ✅ Required (Recruiter for company)
- **User Type:** Recruiter

#### Request Headers
```
Authorization: Bearer {recruiter_token}
```

#### Response (200 OK)
```json
[
  {
    "_id": "507f1f77bcf86cd799439025",
    "student": {
      "_id": "507f1f77bcf86cd799439010",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "status": "Applied",
    "attendance": false,
    "rating": 0
  }
]
```

#### Postman Steps
1. Set method to **GET**
2. URL: `http://localhost:5000/api/applications/drive/507f1f77bcf86cd799439015`
3. Headers → Add `Authorization: Bearer {recruiter_token}`
4. Click **Send**

---

### 4. **Update Application Status** (Recruiter)
- **Endpoint:** `PUT /applications/:id/status`
- **Authentication:** ✅ Required (Recruiter only)
- **User Type:** Recruiter

#### Request Headers
```
Authorization: Bearer {recruiter_token}
```

#### Request Body
```json
{
  "status": "Shortlisted",
  "currentRound": 1
}
```

#### Valid Status Values
- `Applied`
- `Rejected`
- `Shortlisted`
- `Selected`

#### Response (200 OK)
```json
{
  "_id": "507f1f77bcf86cd799439025",
  "status": "Shortlisted",
  "currentRound": 1,
  "updatedAt": "2024-02-14T13:00:00.000Z"
}
```

#### Postman Steps
1. Set method to **PUT**
2. URL: `http://localhost:5000/api/applications/507f1f77bcf86cd799439025/status`
3. Headers → Add `Authorization: Bearer {recruiter_token}`
4. Body → raw → JSON → Paste request body
5. Click **Send**

---

### 5. **Mark Attendance** (Recruiter)
- **Endpoint:** `PUT /applications/:id/attendance`
- **Authentication:** ✅ Required (Recruiter only)
- **User Type:** Recruiter

#### Request Headers
```
Authorization: Bearer {recruiter_token}
```

#### Request Body
```json
{
  "attendance": true
}
```

#### Response (200 OK)
```json
{
  "_id": "507f1f77bcf86cd799439025",
  "attendance": true,
  "updatedAt": "2024-02-14T13:30:00.000Z"
}
```

#### Postman Steps
1. Set method to **PUT**
2. URL: `http://localhost:5000/api/applications/507f1f77bcf86cd799439025/attendance`
3. Headers → Add `Authorization: Bearer {recruiter_token}`
4. Body → raw → JSON → `{"attendance": true}`
5. Click **Send**

---

### 6. **Mark Round Attendance** (Recruiter)
- **Endpoint:** `PUT /applications/:id/round/:roundIndex/attendance`
- **Authentication:** ✅ Required (Recruiter only)
- **User Type:** Recruiter

#### Request Headers
```
Authorization: Bearer {recruiter_token}
```

#### URL Parameters
```
:id = 507f1f77bcf86cd799439025
:roundIndex = 0
```

#### Request Body
```json
{
  "attendance": true
}
```

#### Response (200 OK)
```json
{
  "_id": "507f1f77bcf86cd799439025",
  "rounds": [
    {
      "name": "Technical Round",
      "attendance": true
    }
  ],
  "updatedAt": "2024-02-14T13:45:00.000Z"
}
```

#### Postman Steps
1. Set method to **PUT**
2. URL: `http://localhost:5000/api/applications/507f1f77bcf86cd799439025/round/0/attendance`
3. Headers → Add `Authorization: Bearer {recruiter_token}`
4. Body → raw → JSON → `{"attendance": true}`
5. Click **Send**

---

### 7. **Update Rating & Notes** (Recruiter)
- **Endpoint:** `PUT /applications/:id/rating`
- **Authentication:** ✅ Required (Recruiter only)
- **User Type:** Recruiter

#### Request Headers
```
Authorization: Bearer {recruiter_token}
```

#### Request Body
```json
{
  "rating": 5,
  "notes": "Excellent communication and problem-solving skills"
}
```

#### Rating Scale
- `1` - Poor
- `2` - Below Average
- `3` - Average
- `4` - Good
- `5` - Excellent

#### Response (200 OK)
```json
{
  "_id": "507f1f77bcf86cd799439025",
  "rating": 5,
  "recruiterNotes": "Excellent communication and problem-solving skills",
  "updatedAt": "2024-02-14T14:00:00.000Z"
}
```

#### Postman Steps
1. Set method to **PUT**
2. URL: `http://localhost:5000/api/applications/507f1f77bcf86cd799439025/rating`
3. Headers → Add `Authorization: Bearer {recruiter_token}`
4. Body → raw → JSON → Paste request body
5. Click **Send**

---

### 8. **Update Final Stage** (Recruiter)
- **Endpoint:** `PUT /applications/:id/final-stage`
- **Authentication:** ✅ Required (Recruiter only)
- **User Type:** Recruiter

#### Request Headers
```
Authorization: Bearer {recruiter_token}
```

#### Request Body
```json
{
  "finalStage": true
}
```

#### Response (200 OK)
```json
{
  "_id": "507f1f77bcf86cd799439025",
  "finalStage": true,
  "status": "Selected",
  "updatedAt": "2024-02-14T14:15:00.000Z"
}
```

#### Postman Steps
1. Set method to **PUT**
2. URL: `http://localhost:5000/api/applications/507f1f77bcf86cd799439025/final-stage`
3. Headers → Add `Authorization: Bearer {recruiter_token}`
4. Body → raw → JSON → `{"finalStage": true}`
5. Click **Send**

---

### 9. **Get Student Applications** (Admin)
- **Endpoint:** `GET /applications/student/:id`
- **Authentication:** ✅ Required (Admin only)
- **User Type:** Admin

#### Request Headers
```
Authorization: Bearer {admin_token}
```

#### Response (200 OK)
```json
[
  {
    "_id": "507f1f77bcf86cd799439025",
    "drive": {
      "_id": "507f1f77bcf86cd799439015",
      "jobRole": "Software Engineer"
    },
    "company": {
      "_id": "507f1f77bcf86cd799439020",
      "name": "Tech Corp India"
    },
    "status": "Shortlisted",
    "rating": 4
  }
]
```

#### Postman Steps
1. Set method to **GET**
2. URL: `http://localhost:5000/api/applications/student/507f1f77bcf86cd799439010`
3. Headers → Add `Authorization: Bearer {admin_token}`
4. Click **Send**

---

---

## 📊 DASHBOARD Routes

### 1. **Admin Dashboard**
- **Endpoint:** `GET /dashboard/admin`
- **Authentication:** ✅ Required (Admin only)
- **User Type:** Admin

#### Request Headers
```
Authorization: Bearer {admin_token}
```

#### Response (200 OK)
```json
{
  "totalStudents": 150,
  "totalCompanies": 25,
  "totalDrives": 45,
  "totalApplications": 500,
  "selected": 85,
  "rejected": 150
}
```

#### Postman Steps
1. Set method to **GET**
2. URL: `http://localhost:5000/api/dashboard/admin`
3. Headers → Add `Authorization: Bearer {admin_token}`
4. Click **Send**

---

### 2. **Recruiter Dashboard**
- **Endpoint:** `GET /dashboard/recruiter`
- **Authentication:** ✅ Required (Recruiter only)
- **User Type:** Recruiter

#### Request Headers
```
Authorization: Bearer {recruiter_token}
```

#### Response (200 OK)
```json
{
  "totalApplicants": 120,
  "shortlisted": 30,
  "selected": 8,
  "rejected": 45
}
```

#### Postman Steps
1. Set method to **GET**
2. URL: `http://localhost:5000/api/dashboard/recruiter`
3. Headers → Add `Authorization: Bearer {recruiter_token}`
4. Click **Send**

---

### 3. **Student Dashboard**
- **Endpoint:** `GET /dashboard/student`
- **Authentication:** ✅ Required (Student only)
- **User Type:** Student

#### Request Headers
```
Authorization: Bearer {student_token}
```

#### Response (200 OK)
```json
{
  "totalApplied": 15,
  "selected": 2
}
```

#### Postman Steps
1. Set method to **GET**
2. URL: `http://localhost:5000/api/dashboard/student`
3. Headers → Add `Authorization: Bearer {student_token}`
4. Click **Send**

---

---

## 📋 Complete Postman Testing Flow

### Step 1: Create Admin (Once)
1. Register a user first as student
2. Manually update role to "admin" in database (or use admin creation)
3. Get admin token

### Step 2: Setup (Admin)
1. Create companies
2. Create recruiters
3. Assign recruiters to companies
4. Create job drives

### Step 3: Student Testing
1. Register student
2. Update student profile (phone, course, college, year, skills)
3. Upload resume (PDF format, max 5MB)
4. View active drives
5. Apply to drive
6. Check applications

### Step 4: Recruiter Testing
1. Get recruiter token (login)
2. View my drives
3. Get applications for drive
4. Update application status
5. Mark attendance
6. Rate candidates
7. View dashboard

### Step 5: Admin Reporting
1. View all applications with filters
2. View student applications
3. View admin dashboard

---

## ⚠️ Common Errors & Solutions

| Error | Cause | Fix |
|-------|-------|-----|
| `Not authorized, token missing` | No Authorization header | Add token to header |
| `Invalid token` | Token is invalid/malformed | Re-login and get new token |
| `Token expired` | Token is >7 days old | Re-login to get new token |
| `User not found` | User was deleted | Create new account |
| `User account is inactive` | User isActive = false | Admin must reactivate |
| `You don't have access` | Insufficient permissions | Use correct role token |
| `Resume upload failed` | File not PDF or >5MB | Upload only PDF, max 5MB |
| `Drive not found` | Invalid drive ID | Use correct drive ID |
| `Already applied to drive` | Duplicate application | Cannot apply twice |
| `Profile incomplete` | Missing info before apply | Complete profile first |
| `Application deadline passed` | Drive deadline expired | Apply before deadline |

---

## 💡 Tips for Testing

1. **Save Tokens in Variables**
   - After login, save token in Postman environment variable
   - Use: `{{token_variable}}` in Authorization header

2. **Test Different Roles**
   - Login as student, recruiter, admin separately
   - Save each token to test role-based access

3. **Use Query Parameters**
   - Practice filtering applications by status, date, etc.
   - Example: `/applications/?status=Shortlisted&dateFrom=2024-02-01`

4. **Test Error Cases**
   - Try accessing endpoints without auth
   - Use invalid IDs
   - Try uploading non-PDF files

5. **Check Response Data**
   - Verify data types match documentation
   - Check timestamps are valid
   - Verify populated references have correct data

---

## 📞 API Base Configuration in Postman

Create a new environment in Postman:

**Environment Variables**
```
base_url: http://localhost:5000/api
admin_token: (copy from admin login response)
student_token: (copy from student login response)
recruiter_token: (copy from recruiter login response)
company_id: (copy from create company response)
drive_id: (copy from create drive response)
app_id: (copy from apply response)
```

**Use in URLs**
```
{{base_url}}/auth/register
{{base_url}}/students/profile
```

**Use in Headers**
```
Authorization: Bearer {{admin_token}}
```

---

**Last Updated:** February 14, 2024  
**API Version:** 1.0  
**Frontend URL Setup:** Update `FRONTEND_URL` in .env for CORS
