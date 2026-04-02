# CollabSpace — Backend API

Full-stack setup guide for the CollabSpace student collaboration platform.

---

## 📁 Project Structure

```
collabspace-backend/
├── server.js                  ← Entry point
├── schema.sql                 ← MySQL schema (run once)
├── api.js                     ← Frontend integration helper
├── .env.example               ← Copy to .env and fill in
├── config/
│   └── db.js                  ← MySQL connection pool
├── controllers/
│   ├── authController.js
│   ├── projectsController.js
│   ├── studyGroupsController.js
│   └── resourcesController.js
├── middleware/
│   ├── auth.js                ← JWT middleware
│   └── errorHandler.js
└── routes/
    ├── auth.js
    ├── projects.js
    ├── studyGroups.js
    └── resources.js
```

---

## 🚀 Setup (Step by Step)

### 1. Install MySQL
Download from https://dev.mysql.com/downloads/mysql/ or use XAMPP.

### 2. Create the database
```bash
mysql -u root -p < schema.sql
```

### 3. Install Node dependencies
```bash
npm install
```

### 4. Configure environment
```bash
cp .env.example .env
# Edit .env and set:
#   DB_PASSWORD=your_mysql_root_password
#   JWT_SECRET=any_long_random_string
```

### 5. Run the server
```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

Server starts at: **http://localhost:5000**

---

## 🔌 Connect to Your Frontend HTML

Add this ONE line before the closing `</body>` tag in your HTML:

```html
<script src="path/to/api.js"></script>
```

Then update your modal buttons to call the new API functions:

| Old (mock)                              | New (real API)          |
|-----------------------------------------|-------------------------|
| `onclick="toast('🎉','Project created!')"` | `onclick="createNewProject()"` |
| `onclick="toast('📚','Joined study group!')"` | `onclick="joinStudyGroup(id)"` |
| `onclick="closeModal(); toast(...)"` | `onclick="uploadResource()"` |

---

## 📋 API Endpoints

### Auth
| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| POST | `/api/auth/register` | — | Register new user |
| POST | `/api/auth/login` | — | Login, returns JWT |
| GET | `/api/auth/me` | ✅ | Get current user |
| PUT | `/api/auth/profile` | ✅ | Update bio/skills |
| PUT | `/api/auth/change-password` | ✅ | Change password |

### Projects
| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| GET | `/api/projects` | — | List all projects |
| GET | `/api/projects/:id` | — | Get project + members |
| POST | `/api/projects` | ✅ | Create project (+50 pts) |
| PUT | `/api/projects/:id` | ✅ | Update (owner only) |
| DELETE | `/api/projects/:id` | ✅ | Delete (owner only) |
| POST | `/api/projects/:id/join` | ✅ | Join project (+10 pts) |
| DELETE | `/api/projects/:id/leave` | ✅ | Leave project |

### Study Groups
| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| GET | `/api/study-groups` | — | List all groups |
| GET | `/api/study-groups/:id` | — | Get group + members |
| POST | `/api/study-groups` | ✅ | Create group (+30 pts) |
| DELETE | `/api/study-groups/:id` | ✅ | Delete (owner only) |
| POST | `/api/study-groups/:id/join` | ✅ | Join group (+10 pts) |
| DELETE | `/api/study-groups/:id/leave` | ✅ | Leave group |

### Resources
| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| GET | `/api/resources` | — | List all resources |
| POST | `/api/resources` | ✅ | Upload resource (+20 pts) |
| POST | `/api/resources/:id/download` | ✅ | Track download |
| DELETE | `/api/resources/:id` | ✅ | Delete (uploader only) |

---

## 🧪 Quick Test (curl)

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"first_name":"John","last_name":"Doe","email":"john@test.com","password":"password123","department":"Computer Science","year":"3rd Year"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@collab.edu","password":"password123"}'

# Health check
curl http://localhost:5000/api/health
```

---

## 🎯 Next Steps

1. **Real-time chat** → Add Socket.io to server.js + frontend
2. **Deployment** → Backend on Render.com (free), DB on PlanetScale (free MySQL)
3. **Frontend framework** → Migrate to React for better state management
