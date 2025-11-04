# Eventify

Simple full-stack project:
- Backend: Node.js (Express) + MySQL
- Frontend: React + Tailwind CSS
- Clean REST API between frontend and backend

---

## Requirements

- Node.js 18+
- npm
- MySQL 8+ (or compatible)

---

## 1) Backend Setup

From the project root:

```bash
cd backend
npm install
```

Create backend/.env
```bash
PORT=4000
DB_HOST=localhost
DB_USER=root
DB_PASS=yourpassword
DB_NAME=eventflow
DB_PORT=3306
```
Start the backend:
```bash
npm run dev
```

#Frontend Setup
```bash
cd frontend
npm install
```

Create frontend/.env
```bash
REACT_APP_API_BASE=http://localhost:4000/api
```

```bash
npm start
```

#Author
Ahmad Alhourani
