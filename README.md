# 🚀 TeamTrackr – Project Management Web App

A full-stack project management application where teams can create projects, assign tasks, and track progress with **role-based access control (Admin/Member)**.

---

## 📌 Overview

**TeamTrackr** helps teams collaborate efficiently by organizing work into projects and tasks. It provides authentication, role-based permissions, and a dashboard to monitor progress and deadlines.

---

## ✨ Features

### 🔐 Authentication

* User Signup & Login
* Secure password hashing
* JWT-based authentication

### 👥 Role-Based Access

* **Admin**

  * Create & manage projects
  * Assign tasks to members
* **Member**

  * View assigned tasks
  * Update task status

### 📁 Project Management

* Create and manage projects
* Add team members
* View project details

### 📌 Task Management

* Create tasks within projects
* Assign tasks to users
* Track task status:

  * Pending
  * In Progress
  * Completed
* Set due dates

### 📊 Dashboard

* View all tasks
* Track progress by status
* Identify overdue tasks

---

## 🛠️ Tech Stack

### 🔹 Frontend

* React (Vite)
* Tailwind CSS
* Axios

### 🔹 Backend

* Node.js
* Express.js
* MongoDB + Mongoose

### 🔹 Authentication

* JSON Web Tokens (JWT)
* bcrypt for password hashing

---

## 📁 Project Structure

```
project-management-app/
├── backend/
│   └── src/
│       ├── config/
│       ├── models/
│       ├── controllers/
│       ├── routes/
│       ├── middleware/
│       └── server.js
│
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── context/
│       ├── utils/
│       └── App.jsx
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```
git clone https://github.com/your-username/TeamTrackr.git
cd TeamTrackr
```

---

### 2️⃣ Backend Setup

```
cd backend
npm install
```

Create `.env` file:

```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
PORT=5000
```

Run backend:

```
npm run dev
```

---

### 3️⃣ Frontend Setup

```
cd frontend
npm install
npm run dev
```

---

## 🌐 API Endpoints (Sample)

### Auth

* `POST /api/v1/user/signup`
* `POST /api/v1/user/signin`

### Projects

* `GET /api/v1/projects`
* `POST /api/v1/projects`

### Tasks

* `GET /api/v1/tasks`
* `POST /api/v1/tasks`
* `PUT /api/v1/tasks/:id`

---

## 🔐 Authorization

Protected routes require:

```
Authorization: Bearer <token>
```

---

## 🧪 Testing

* Use Postman to test APIs
* First login to get JWT token
* Use token for protected routes

---

## 📈 Future Improvements

* Notifications for deadlines
* File attachments for tasks
* Real-time updates (WebSockets)
* Team chat integration

---

## 👩‍💻 Author

**Shreya Sahu**
Computer Science Undergraduate (AI & ML)

---

## ⭐ Contribution

Feel free to fork this repository and contribute!

---

## 📄 License

This project is open-source and available under the MIT License.
