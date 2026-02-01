# 🔐 Credentials Vault

A secure, modern, and fully responsive web application for managing digital credentials, important links, and cloud media assets — built with the MERN stack and cloud storage integration.

---

## 🚀 Overview

**Credentials Vault** is a full-stack secure storage platform that allows users to safely store, manage, and organize:

* 🔑 Website credentials
* 🔗 Important links
* 🖼️ Images, videos, and files
* 👤 Personal account information

All data is protected and managed through an intuitive, encrypted, and responsive dashboard.

---

## ✨ Features

### 🔐 Authentication

* User Registration & Login
* Secure session handling
* Protected routes

### 📁 Web Vault (Credentials)

* Create / Read / Update / Delete credentials
* Store website name, username, email, and password
* Password visibility toggle
* Encrypted data handling

### 🔗 Important Links

* Add useful links
* Edit & delete links
* Direct visit feature
* Categorized platform storage

### ☁️ Cloud Media Vault

* Upload images & videos
* Cloudinary-based storage
* Media preview
* Video popup player
* Delete & update assets

### ⚙️ Settings

* Update personal profile
* Password management
* User session management

### 📱 Responsive UI

* Mobile-first design
* Tablet optimized
* Desktop dashboard layout
* No overflow issues

---

## 🛠️ Tech Stack

### Frontend

* ⚛️ React (Vite)
* 🎨 Tailwind CSS
* 📦 Axios
* 🔀 React Router
* 🎭 React Icons

### Backend

* 🟢 Node.js
* 🚀 Express.js
* 🗄️ MongoDB (Mongoose)

### Cloud & Storage

* ☁️ Cloudinary (Media Storage)

### Security

* 🔐 Environment Variables
* 🔑 Password Hashing
* 🛡️ API Protection
* 🌐 CORS Configuration

---

## 📂 Project Structure

```
Credentials/
│
├── backend/
│   ├── config/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── index.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── main.jsx
│
└── README.md
```

---

## ⚙️ Environment Variables

### Frontend (`frontend/.env`)

```env
VITE_API_KEY=http://localhost:3000
```

### Backend (`backend/.env`)

```env
PORT=3000
MONGO_URI=your_mongodb_connection
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

> ⚠️ Never push `.env` files to GitHub.

---

## 📦 Installation

### 1️⃣ Clone Repository

```bash
git clone https://github.com/masterSahil/Credentials.git
cd Credentials
```

---

### 2️⃣ Install Backend Dependencies

```bash
cd backend
npm install
```

---

### 3️⃣ Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

### 4️⃣ Run Backend

```bash
cd backend
npm run dev
```

Runs on:

```
http://localhost:3000
```

---

### 5️⃣ Run Frontend

```bash
cd frontend
npm run dev
```

Runs on:

```
http://localhost:5173
```

---

## 🔄 CRUD Operations

### 🔐 Credentials Vault

| Action | Support |
| ------ | ------- |
| Create | ✅       |
| Read   | ✅       |
| Update | ✅       |
| Delete | ✅       |

### 🔗 Links Vault

| Action | Support |
| ------ | ------- |
| Create | ✅       |
| Read   | ✅       |
| Update | ✅       |
| Delete | ✅       |

### ☁️ Media Vault

| Action  | Support |
| ------- | ------- |
| Upload  | ✅       |
| Preview | ✅       |
| Update  | ✅       |
| Delete  | ✅       |

---

## 📸 Screenshots

> Add application screenshots here.

---

## 🌍 Deployment

### Frontend

* Vercel
* Netlify

### Backend

* Render
* Railway
* Cyclic

### Database

* MongoDB Atlas

---

## 🔐 Security Practices

* Environment variable protection
* Password hashing
* API route validation
* JWT authentication
* CORS restrictions
* Cloudinary secure URLs

---

## 👨‍💻 Developer

**Master Sahil**
Full Stack Developer
Specialized in MERN & Cloud Applications

---

## 📜 License

This project is licensed under the MIT License.

---

## ⭐ Support

If you like this project:

🌟 Star the repository
🐛 Report issues
💡 Suggest features

---

## ❤️ Acknowledgements

* React Community
* Tailwind CSS
* MongoDB
* Cloudinary
* Open Source Contributors