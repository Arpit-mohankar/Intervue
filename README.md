
# 🗳️ Live Polling System

A real-time polling system for teachers and students, built with **React**, **Express**, **Socket.IO**, and **Node.js**.

---

## 🔧 Features

### 👨‍🏫 Teacher
- Create a new poll
- Ask one question at a time
- View live poll results
- See real-time student participation

### 👨‍🎓 Student
- Join by entering name
- Submit answers in real-time
- View poll results after submission
- Limited time to answer (60 seconds)

---

## 🛠️ Tech Stack

| Frontend | Backend | Real-time |
|----------|---------|-----------|
| React    | Express | Socket.IO |
| Redux    | Node.js |           |
| CSS      | CORS    |           |

---

## 🗂️ Folder Structure

```
live-polling-system/
│
├── client/                       # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/           # ChatPopup, StudentForm, TeacherDashboard, etc.
│   │   ├── pages/                # StudentPage, TeacherPage
│   │   ├── services/
│   │   │   └── socketService.js  # Handles client-side socket communication
│   │   ├── redux/                # Redux setup (store, slices)
│   │   ├── App.js
│   │   └── index.js
│   ├── .env                     # Frontend environment variables
│   └── package.json
│
├── server/                      # Express + Socket.IO backend
│   ├── index.js                 # Main server file
│   ├── controllers/
│   ├── models/                  # Optional: if using DB
│   └── .env                     # Backend environment variables
│
├── .gitignore
├── README.md
└── package.json                 # Root, optional for monorepo style
```

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/Arpit-mohankar/live-polling-system.git
cd live-polling-system
```

---

### 2. Backend Setup (server/)

```bash
cd server
npm install
npm run dev
```

> Update `.env` if needed.

---

### 3. Frontend Setup (client/)

```bash
cd ../client
npm install
npm start
```

> Make sure to set `REACT_APP_SOCKET_URL` in `client/.env`:

```env
REACT_APP_SOCKET_URL=http://localhost:5000
```



## 🙌 Contribution

PRs and suggestions are welcome! Open an issue or create a pull request.

---

## 📄 License

This project is licensed under the MIT License.
