# Students Result Management System

A professional, full-featured Students Result Management System built with the MERN stack.

## ✨ Features

- **Professional Dashboard** with Analytics (Charts & Graphs)
- **Student Management** (Add, Edit, Delete, Search)
- **Result Management** with PDF Download
- **Secure Authentication** (Bcrypt & JWT)
- **Responsive Design** (Mobile & Desktop)
- **Public Result Search** by Roll Number
- **Dark Mode** Support
- **Command Palette** (Ctrl+K) for Power Users
- **Teacher Portal** with separate dashboard
- **Bulk Upload** functionality for results

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (optional - falls back to in-memory database)

### Backend Setup

```bash
cd server

# Install dependencies
npm install

# Create environment file (or copy from example)
cp .env.example .env

# Start the server
npm start
# or with nodemon for development
npm run dev
```

### Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be running at:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

## 🔒 Environment Variables

Create a `.env` file in the `server` directory:

```env
# Server Port
PORT=5000

# MongoDB Connection
# Local MongoDB:
MONGODB_URI=mongodb://localhost:27017/student_result

# MongoDB Atlas (optional):
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/student_result

# JWT Configuration
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRY=24h

# Environment
NODE_ENV=development
```

## 👤 Default Login Credentials

> **Note:** These are default credentials for development. Change them in production!

| Role | Username/Email | Password |
|------|----------------|----------|
| Admin | admin | admin123 |
| Teacher | rahman@university.edu | teacher123 |

## 💻 Technology Stack

| Category | Technologies |
|----------|-------------|
| **Backend** | Node.js, Express, MongoDB, Mongoose, JWT |
| **Frontend** | React 19, Vite, TailwindCSS, Recharts |
| **Authentication** | Bcrypt, JWT Tokens |
| **PDF Generation** | jsPDF, jspdf-autotable |
| **Animation** | Framer Motion |
| **Icons** | Lucide React |

## 📁 Project Structure

```
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React Context providers
│   │   └── utils/          # Helper functions
│   └── ...
│
├── server/                 # Node.js Backend
│   ├── controllers/        # Route handlers
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API routes
│   ├── middleware/        # Auth middleware
│   └── utils/             # Helper utilities
│
└── README.md
```

## 🧪 Sample Data

The system automatically seeds demo data when using in-memory database:
- 120 sample students
- Multiple teachers
- Results with realistic CGPA distribution
- Various departments (CSE, EEE, Civil, Mechanical, ETE)

To manually seed data:
```bash
cd server
node seed.js
```

## 🛡️ Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting on API endpoints
- Helmet.js security headers
- Input validation with express-validator
- Protected routes for admin/teacher areas

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile devices

## 🎨 UI Features

- Dark/Light mode toggle
- Smooth animations and transitions
- Glassmorphism design elements
- Custom scrollbars
- Toast notifications
- Command palette (Ctrl+K)
- Keyboard shortcuts

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

**Built for Diploma CST 6th Semester Web Development Project** 🎓
