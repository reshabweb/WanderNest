<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:EF4444,100:F97316&height=200&section=header&text=WanderNest&fontSize=55&fontColor=fff&animation=twinkling"/>

# 🏠 WanderNest

### A decoupled full-stack house rental platform that allows users to discover, save, and manage rental properties with role-based access for Guests and Hosts. Built using React.js, Node.js, Express.js, MongoDB, and Docker.

[![Stars](https://img.shields.io/github/stars/reshabweb/WanderNest?style=for-the-badge&color=7C3AED)](https://github.com/reshabweb/WanderNest/stargazers)
[![Forks](https://img.shields.io/github/forks/reshabweb/WanderNest?style=for-the-badge&color=58A6FF)](https://github.com/reshabweb/WanderNest/network/members)
[![Issues](https://img.shields.io/github/issues/reshabweb/WanderNest?style=for-the-badge&color=F59E0B)](https://github.com/reshabweb/WanderNest/issues)
[![License](https://img.shields.io/github/license/reshabweb/WanderNest?style=for-the-badge&color=10B981)](https://github.com/reshabweb/WanderNest/blob/main/LICENSE)

</div>

---

# 📖 Overview

WanderNest is a decoupled full-stack house rental platform inspired by modern vacation rental applications. The platform allows users to browse rental properties, view detailed information, save favorite homes, and manage listings.

The application supports role-based user registration where users can join as Guests or Hosts. Hosts can add, edit, and delete property listings through a dashboard, while Guests can browse properties and save them to their favorites list.

Built using Node.js, Express.js, MongoDB, React.js (Vite), Tailwind CSS, and containerized with Docker, WanderNest demonstrates full-stack development concepts including REST APIs, session management, image file uploads, database integration, and microservice containerization.

---

# 🎯 Project Goals

- Decouple a monolithic EJS project into a modern Client-Server architecture
- Implement cookie/session-based authentication across cross-origin requests
- Enable role-based access control (Guest & Host)
- Manage rental property listings with dynamic form uploads
- Allow users to save favorite properties in real time
- Containerize the entire stack (React, Express API, MongoDB) using Docker Compose
- Demonstrate MVC backend architecture and state-managed React components

---

# ✨ Features

## 🔐 Authentication & Authorization

- User Registration
- User Login
- User Logout (Clearing session cookies)
- Password Hashing using bcryptjs
- Cross-Origin Session-Based Authentication (express-session)
- Role-Based User Registration
- Protected Frontend Routes and Backend API guards

## 🏠 Property Management

- Add New Property (Host Only)
- Edit Property Details (Host Only)
- Delete Property (Host Only)
- View Property Details (Guests & Hosts)
- Upload Property Images (Multer)
- Manage Hosted Properties via Dashboard

## ❤️ Favorites System

- Save Properties to Favorites (Guest Only)
- Remove Properties from Favorites (Guest Only)
- View Favorite Properties List

## 👨‍💼 Host Dashboard

- View Hosted Properties Table
- Manage Listings
- Edit Existing Properties
- Delete Existing Properties

## 🎨 Frontend Features

- Responsive Design
- Modern Single-Page Application (React Router DOM)
- Tailwind CSS Styling
- Interactive User Interface
- Search Query and Location Dropdown Filters

## ⚡ Backend Features

- RESTful API controllers
- Express.js Routing
- MongoDB Database Integration (Mongoose)
- CORS configuration for credentials sharing
- File Upload Handling (Multer)

---

# 🚀 Tech Stack

<p align="left">
  <img src="https://skillicons.dev/icons?i=react,nodejs,express,mongodb,docker,tailwind,git,github,vscode" alt="Tech Stack" />
</p>

![Mongoose](https://img.shields.io/badge/Database-Mongoose-green)
![React](https://img.shields.io/badge/View-React.js-61DAFB)
![bcryptjs](https://img.shields.io/badge/Security-bcryptjs-blue)
![Express Session](https://img.shields.io/badge/Auth-ExpressSession-red)
![Multer](https://img.shields.io/badge/FileUpload-Multer-yellow)
![Tailwind CSS](https://img.shields.io/badge/UI-TailwindCSS-06B6D4)

---

## 🏗️ Architecture

```text
Client Browser (React SPA)
      │
      ▼ (Axios REST Requests)
Express Server REST API (Backend)
      │
      ├── Routes & Controllers
      ├── Session Cookie Authentication
      ├── MongoDB Database (Mongoose)
      └── Static File Server (Uploads)
```

### Request Flow

1. React frontend sends request using Axios with credentials configured.
2. Express CORS middleware intercepts and validates session cookie.
3. Protected endpoints verify the authenticated session.
4. Controllers execute database queries using Mongoose models.
5. JSON responses are returned to the client to update local state.
6. React page components render layout modifications.

---

# 📂 Project Structure

```text
WanderNest-main
│
├── Backend/                     # Node/Express REST API
│   ├── controllers/             # REST API controller handlers
│   ├── models/                  # Mongoose database schemas
│   ├── routes/                  # API routers (auth, host, store)
│   ├── public/                  # Backend static assets
│   ├── Screenshots/             # Documentation screenshots
│   ├── Utils/                   # Helper utilities
│   ├── .dockerignore            # Backend docker exclusion list
│   ├── .env.example             # Environment vars template
│   ├── Dockerfile               # Backend docker build image
│   ├── package.json             # Backend node configuration
│   ├── seed.js                  # Database initial seeding script
│   └── test.js                  # Main server entry file
│
├── Frontend/                    # React.js Vite Client
│   ├── public/                  # Frontend static icons & assets
│   ├── src/
│   │   ├── assets/              # Client image assets
│   │   ├── components/          # Shared components (Navbar, HomeCard)
│   │   ├── pages/               # SPA pages (HomeList, Favourites, HostDashboard)
│   │   ├── App.jsx              # Routing guards & AuthContext
│   │   ├── index.css            # Tailwind style declarations
│   │   └── main.jsx             # React DOM entry point
│   ├── .dockerignore            # Frontend docker exclusion list
│   ├── Dockerfile               # Frontend docker build image
│   ├── index.html               # Main HTML document & Inter Font
│   ├── package.json             # Frontend Vite configuration
│   └── vite.config.js           # Vite server settings
│
├── .dockerignore                # Root docker exclusion list
├── docker-compose.yml           # Multi-container stack orchestrator
└── README.md                    # Main project documentation
```

---

# ⚙️ Installation

To run this application locally, you can choose to run it directly on your machine or inside Docker containers.

### Method A: Run with Docker Compose (Recommended)

Make sure you have Docker installed. Run the following command from the project root:

```bash

docker compose up -d --build
```

The stack starts the following nodes:

- **React Frontend**: [http://localhost:5173](http://localhost:5173)
- **Express Backend**: [http://localhost:3001](http://localhost:3001)
- **MongoDB Database**: running on port `27017`

To check logs or shutdown:

```bash

docker compose logs -f


docker compose down
```

---

### Method B: Run Locally on Host Machine

#### 1. Setup Backend

```bash

cd Backend


npm install


npm start
```

#### 2. Setup Frontend

```bash

cd Frontend


npm install


npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

# 🔑 Environment Variables

Create a `.env` file in the `/Backend` directory:

```env
PORT=3001
MONGODB_URI=your_mongodb_url
SESSION_SECRET=your_wander_nest_session_secret
```

---

# 📋 REST API Routes

## Authentication

| Method | Route             | Description                         |
| ------ | ----------------- | ----------------------------------- |
| POST   | `/login`          | Authenticate User & Set Session     |
| POST   | `/signup`         | Register User (validates entries)   |
| POST   | `/logout`         | Destroy User Session & Clear Cookie |
| GET    | `/api/check-auth` | Retrieve Current Session User       |

---

## Properties (Public/Guest)

| Method | Route            | Description               |
| ------ | ---------------- | ------------------------- |
| GET    | `/homes`         | Retrieve All Listings     |
| GET    | `/homes/:homeId` | Retrieve Property Details |

---

## Host Management (Host Protected)

| Method | Route                       | Description                            |
| ------ | --------------------------- | -------------------------------------- |
| GET    | `/host/host-home-list`      | Retrieve Listings for Host Dashboard   |
| GET    | `/host/edit-home/:homeId`   | Retrieve Single Property for Editing   |
| POST   | `/host/add-home`            | Create Property (handles file uploads) |
| POST   | `/host/edit-home`           | Update Property (handles new files)    |
| POST   | `/host/delete-home/:homeId` | Delete Property from database and disk |

---

## Favorites (Guest Protected)

| Method | Route                        | Description                    |
| ------ | ---------------------------- | ------------------------------ |
| GET    | `/favourites`                | Retrieve Guest Saved Favorites |
| POST   | `/favourites`                | Add Listing to Favorites       |
| POST   | `/favourites/delete/:homeId` | Remove Listing from Favorites  |

---

# 🎯 What I Learned

- Decoupling monolithic EJS layouts into a single-page React client (Vite).
- Cross-origin credentials sharing configurations (`credentials: true` and `withCredentials: true`).
- Coordinating image file uploads via multipart `FormData` objects in React.
- Orchestrating node servers, React containers, and persistent MongoDB database volumes using Docker Compose.
- Writing optimized Dockerfiles and utilizing layer caching with package files.

---

# 👨‍💻 Developer

### Reshab

Full-Stack Developer passionate about building scalable web applications using Node.js, React.js, Express.js, MongoDB, Docker, and modern web technologies.

---

# 📄 License

This project is licensed under the MIT License.

---

<div align="center">

⭐ Star this repository if you like it!

Made with ❤️ by [reshabweb](https://github.com/reshabweb)

</div>
