# Placement Management System - Backend

A MERN stack backend for managing placement drives, company registrations, and student applications.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT
- **File Storage**: ImageKit
- **File Upload**: Multer

## Prerequisites

- Node.js v18+ installed
- npm or yarn package manager
- MongoDB Atlas account & connection string
- ImageKit account (for resume uploads)

## Installation & Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

**Required Environment Variables:**

```
# Server
PORT=5000
NODE_ENV=development

# Authentication
JWT_SECRET=your_very_secure_random_string_min_32_chars

# Database
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/dbname

# ImageKit (Resume Storage)
IMAGE_KIT_PUBLIC_KEY=your_public_key
IMAGE_KIT_PRIVATE_KEY=your_private_key
IMAGE_KIT_URL_ENDPOINT=https://ik.imagekit.io/your_id

# Frontend
FRONTEND_URL=http://localhost:5173
```

### 3. Generate JWT Secret

Generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output to `JWT_SECRET` in your `.env` file.

### 4. MongoDB Setup

1. Create a MongoDB Atlas account: https://www.mongodb.com/cloud/atlas
2. Create a cluster and database
3. Get your connection string
4. Add to `.env` as `MONGODB_URL`

### 5. ImageKit Setup

1. Sign up at: https://imagekit.io
2. Get your credentials from Dashboard → Settings
3. Add to `.env`:
   - `IMAGE_KIT_PUBLIC_KEY`
   - `IMAGE_KIT_PRIVATE_KEY`
   - `IMAGE_KIT_URL_ENDPOINT`

## Running the Server

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Public Routes

```
GET  /api/auth/register              - Register student
POST /api/auth/login                 - Login user
GET  /api/drives                     - Get all drives (students can view)
GET  /api/drives/:id                 - Get drive details
```

### Student Routes (Protected)

```
GET    /api/students/profile                 - Get student profile
PUT    /api/students/profile                 - Update profile
POST   /api/students/upload-resume           - Upload resume
GET    /api/students/drives                  - Get active drives
POST   /api/students/apply/:driveId          - Apply to drive
GET    /api/students/applications            - Get my applications
GET    /api/dashboard/student                - Student dashboard
```

### Admin Routes (Protected)

```
POST   /api/auth/create-recruiter           - Create recruiter account
POST   /api/auth/create-admin                - Create admin account
POST   /api/companies                        - Create company
GET    /api/companies                        - Get all companies
GET    /api/companies/:id                    - Get company details
PUT    /api/companies/:id                    - Update company
DELETE /api/companies/:id                    - Delete company
POST   /api/companies/:id/assign-recruiter   - Assign recruiter
POST   /api/companies/:id/remove-recruiter   - Remove recruiter
POST   /api/drives                           - Create drive
PUT    /api/drives/:id                       - Update drive
DELETE /api/drives/:id                       - Delete drive
GET    /api/applications                     - Get all applications (with filters)
GET    /api/applications/student/:id         - Get student applications
GET    /api/dashboard/admin                  - Admin dashboard
```

### Recruiter Routes (Protected)

```
GET    /api/drives/my/drives                 - Get company drives
GET    /api/drives/company/:companyId        - Get drives by company
GET    /api/applications/drive/:driveId      - Get drive applicants
PUT    /api/applications/:id/status          - Update application status
PUT    /api/applications/:id/attendance      - Mark attendance
PUT    /api/applications/:id/round/:roundIndex/attendance - Mark round attendance
PUT    /api/applications/:id/rating          - Update rating & notes
PUT    /api/applications/:id/final-stage     - Update final stage (LOI/Offer)
GET    /api/dashboard/recruiter              - Recruiter dashboard
```

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js                 # MongoDB connection
│   │   └── imagekit.js           # ImageKit configuration
│   ├── controllers/              # Request handlers
│   ├── middleware/               # Express middleware
│   ├── models/                   # MongoDB schemas
│   ├── routes/                   # API routes
│   ├── services/                 # Business logic
│   ├── app.js                    # Express app setup
│   └── db.js                     # DB initialization
├── index.js                      # Server entry point
├── package.json
├── .env                          # Environment variables
└── .env.example                  # Environment template
```

## Error Handling

The application includes comprehensive error handling for:

- ✅ Missing environment variables
- ✅ MongoDB connection errors
- ✅ JWT validation & expiration
- ✅ File upload errors (size, format)
- ✅ Validation errors
- ✅ ImageKit upload failures
- ✅ Duplicate database entries
- ✅ User authentication failures
- ✅ Authorization failures

## Common Issues & Solutions

### Issue: "MANDATORY_PUBLIC_KEY_MISSING"

**Cause**: ImageKit credentials not set in `.env`

**Solution**:
```bash
# Make sure these are in .env:
IMAGE_KIT_PUBLIC_KEY=your_key
IMAGE_KIT_PRIVATE_KEY=your_key
IMAGE_KIT_URL_ENDPOINT=your_endpoint
```

### Issue: "MongoDB Connection Failed"

**Cause**: Invalid connection string or no internet

**Solution**:
```bash
# Check MONGODB_URL in .env
# Verify MongoDB Atlas IP whitelist includes your IP
# Test connection string in MongoDB Compass
```

### Issue: "JWT_SECRET is not defined"

**Cause**: Missing JWT_SECRET in `.env`

**Solution**:
```bash
# Generate a new secret:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Add to .env:
JWT_SECRET=<generated_secret>
```

### Issue: "CORS error"

**Cause**: Frontend URL doesn't match FRONTEND_URL in `.env`

**Solution**:
```bash
# Update FRONTEND_URL to match your frontend:
FRONTEND_URL=http://localhost:5173
FRONTEND_URL=https://yourdomain.com  # for production
```

### Issue: "Only PDF files are allowed"

**Cause**: Uploading non-PDF resume

**Solution**: Only PDF files are supported. Convert your resume to PDF.

### Issue: "File size exceeds 5MB limit"

**Cause**: Resume file too large

**Solution**: Compress your PDF or reduce file size (max 5MB)

## Development Tips

### Debugging

Enable more detailed logs:

```bash
# In .env
NODE_ENV=development

# Logs will include stack traces and error details
```

### Testing API

Use Postman or Insomnia to test endpoints:

1. Import API collection
2. Set environment variables (BASE_URL, TOKEN)
3. Test endpoints

### Database Inspection

Use MongoDB Compass to view/modify data:

```
mongodb+srv://username:password@cluster.mongodb.net
```

## Deployment

### Deploy to Render

1. Push code to GitHub
2. Connect Render to GitHub repo
3. Set environment variables in Render dashboard
4. Deploy


## Support

For issues, check:

1. Console error messages
2. `.env` configuration
3. MongoDB connection
4. ImageKit credentials
5. CORS settings

