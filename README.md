# 🌿 Revogue — Fashion Swap Platform

> A sustainable, AI-powered web platform enabling users to exchange pre-loved fashion items freely — no money, no waste, just community.

![Platform](https://img.shields.io/badge/Platform-Web-blue)
![Stack](https://img.shields.io/badge/Stack-MERN-green)
![AI](https://img.shields.io/badge/AI-Gemini%202.5%20Flash%20%7C%20LLaMA%203.3%2070B-purple)
![Deployment](https://img.shields.io/badge/Deployed-Netlify%20%7C%20Render-teal)
![License](https://img.shields.io/badge/License-Academic-orange)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Live Demo](#live-demo)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Installation](#installation)
  - [Running Locally](#running-locally)
- [Deployment](#deployment)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [AI Features](#ai-features)
- [Sustainability Dashboard](#sustainability-dashboard)
- [Testing](#testing)
- [Screenshots](#screenshots)
- [Academic Information](#academic-information)
- [Author](#author)

---

## Overview

Revogue is a full-stack web application developed as a final-year computing project at NSBM Green University / University of Plymouth. The platform addresses the environmental impact of fast fashion by enabling users to swap pre-loved clothing and accessories directly — completely free of charge, with no monetary transactions involved.

The global fashion industry produces approximately **92 million tonnes of textile waste annually** and contributes an estimated **4–10% of global carbon emissions** (Niinimäki et al., 2020). Revogue provides a practical, technology-driven response: a community-oriented swap platform that combines free exchange, AI-assisted usability, and real-time sustainability impact reporting.

### What makes Revogue different?

| Feature | Depop | Vinted | ThredUp | Revogue |
|---|---|---|---|---|
| Free Exchange (No Money) | ❌ | ❌ | ❌ | ✅ |
| AI Item Tagging | ❌ | ❌ | ❌ | ✅ |
| AI Chatbot Assistant | ❌ | ❌ | ❌ | ✅ |
| Sustainability Dashboard | ❌ | ❌ | Partial | ✅ |
| In-Swap Messaging | ❌ | Basic | ❌ | ✅ |
| Community Reviews | ✅ | ✅ | ❌ | ✅ |

---

## Live Demo

| Service | URL |
|---|---|
| 🌐 Frontend (Netlify) | _[Your Netlify URL]_ |
| ⚙️ Backend API (Render) | _[Your Render URL]_ |

> **Note:** The Render backend may take 30–60 seconds to wake from cold start on the free tier.

---

## Key Features

### 👤 User Authentication
- Register with name, email, and password
- Login with JWT-based stateless session management
- Forgot password / reset password flow
- Profile management with profile picture upload
- Role-based access control (User / Admin)

### 👗 Item Management
- Upload fashion items with one or more photographs
- **AI-assisted automated tagging** — one photo auto-populates all fields
- Manual listing mode with full field control
- Browse all available items with real-time search and category filter
- Edit and delete own listings
- Item status lifecycle: `available` → `pending` → `swapped`

### 🔄 Swap Workflow
- Send swap requests by selecting an item to offer in exchange
- Accept, decline, or cancel pending swap requests
- Automatic item status transitions on each lifecycle event
- Full swap history visible in the swap management dashboard

### 💬 Messaging & Notifications
- In-swap messaging available after swap acceptance
- Five notification types: request received, accepted, declined, cancelled, new message
- Unread notification badge counter in the navigation bar

### ⭐ Community Feedback
- Submit, edit, and delete star-rated text reviews
- All authenticated users can review the platform community

### 🌍 Sustainability Analytics Dashboard
- Platform-wide CO₂ savings (kg), water savings (litres), and financial savings (£)
- Interactive PieChart with category breakdown (Recharts)
- Per-category filter slicer for granular analysis
- Personal impact panel showing the logged-in user's individual contribution
- Metrics grounded in peer-reviewed academic literature

### 🤖 Reva AI Chatbot
- Floating chat widget accessible on all pages
- Answers questions about platform usage and sustainable fashion
- Powered by Groq / LLaMA 3.3 70B Versatile
- Four pre-defined quick-question buttons for easy initiation
- Full conversation history maintained per session

### 🛠️ Admin Dashboard
- Platform-wide statistics (users, items, swaps)
- User management (view, delete)
- Item management (view, delete)
- Swap oversight (view all, manage)
- Sustainability data overview

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React.js | 19 | Component-based UI framework |
| Vite | 7 | Build toolchain and dev server |
| React Router DOM | v7 | Client-side SPA routing |
| Axios | v1.14 | HTTP client for API communication |
| Recharts | v3.8 | Sustainability dashboard visualisations |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | LTS | JavaScript runtime |
| Express.js | v5 | RESTful API framework |
| Mongoose | v9.3 | MongoDB ODM with schema validation |
| jsonwebtoken | Standard | Stateless JWT authentication |
| bcryptjs | v3 | Password hashing (salt factor 10) |
| Multer | v2.1 | Multipart file upload middleware |

### Database & Storage
| Service | Purpose |
|---|---|
| MongoDB Atlas | Cloud-hosted document database |
| Cloudinary | Image upload, storage, and CDN delivery |

### AI Services
| Service | Model | Purpose |
|---|---|---|
| Google Gemini API | Gemini 2.5 Flash | Automated item tagging from photographs |
| Groq API | LLaMA 3.3 70B Versatile | Reva AI chatbot inference |

### Deployment
| Service | Provider | Purpose |
|---|---|---|
| Frontend Hosting | Netlify | Static site delivery + CI/CD from GitHub |
| Backend Hosting | Render | Node.js web service hosting |
| Database | MongoDB Atlas | Managed cloud database cluster |
| Media Storage | Cloudinary | Image CDN and transformation |

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER LAYER                              │
│              Web Browser (Desktop / Mobile)                     │
└─────────────────────────┬───────────────────────────────────────┘
                          │ HTTPS
┌─────────────────────────▼───────────────────────────────────────┐
│                    PRESENTATION LAYER                           │
│              React.js SPA (Hosted on Netlify)                   │
│         Axios HTTP Client │ React Router │ Recharts             │
└─────────────────────────┬───────────────────────────────────────┘
                          │ REST API (HTTPS)
┌─────────────────────────▼───────────────────────────────────────┐
│                    APPLICATION LAYER                            │
│           Node.js + Express.js (Hosted on Render)               │
│    JWT Auth Middleware │ Route Controllers │ Mongoose ODM        │
│                        │                                        │
│      ┌─────────────────┼──────────────────┐                     │
│      │                 │                  │                     │
│  Gemini API       Groq API          Cloudinary SDK              │
│  (AI Tagging)    (Chatbot)       (Image Storage)                │
└─────────────────────────┬───────────────────────────────────────┘
                          │ Mongoose
┌─────────────────────────▼───────────────────────────────────────┐
│                       DATA LAYER                                │
│              MongoDB Atlas (Cloud Database)                     │
│  Users │ Items │ Swaps │ Messages │ Notifications │ Feedback    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
revogue/
│
├── frontend/                        # React.js application
│   ├── public/
│   ├── src/
│   │   ├── assets/                  # Static assets and icons
│   │   ├── components/              # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── ItemCard.jsx
│   │   │   ├── SwapRequestModal.jsx
│   │   │   ├── ChatBot.jsx          # Reva AI chatbot widget
│   │   │   ├── NotificationBell.jsx
│   │   │   └── ...
│   │   ├── pages/                   # Route-level page components
│   │   │   ├── HomePage.jsx
│   │   │   ├── ItemsPage.jsx
│   │   │   ├── UploadItemPage.jsx
│   │   │   ├── SwapRequestsPage.jsx
│   │   │   ├── SustainabilityPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── AdminPage.jsx
│   │   │   ├── FeedbackPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── ForgotPasswordPage.jsx
│   │   ├── context/                 # React Context for auth state
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx                  # Root component and routing
│   │   └── main.jsx                 # Entry point
│   ├── .env                         # Frontend environment variables
│   ├── vite.config.js
│   └── package.json
│
├── backend/                         # Node.js + Express.js API
│   ├── config/
│   │   └── db.js                    # MongoDB Atlas connection
│   ├── controllers/                 # Business logic per resource
│   │   ├── userController.js
│   │   ├── itemController.js        # Includes AI tagging handler
│   │   ├── swapController.js
│   │   ├── messageController.js
│   │   ├── notificationController.js
│   │   ├── feedbackController.js
│   │   ├── adminController.js
│   │   ├── sustainabilityController.js
│   │   └── chatController.js        # Reva chatbot handler
│   ├── middleware/
│   │   ├── authMiddleware.js        # JWT verification
│   │   └── uploadMiddleware.js      # Multer + Cloudinary config
│   ├── models/                      # Mongoose schemas
│   │   ├── User.js
│   │   ├── Item.js
│   │   ├── Swap.js
│   │   ├── Message.js
│   │   ├── Notification.js
│   │   └── Feedback.js
│   ├── routes/                      # Express route definitions
│   │   ├── userRoutes.js
│   │   ├── itemRoutes.js
│   │   ├── swapRoutes.js
│   │   ├── messageRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── feedbackRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── sustainabilityRoutes.js
│   │   └── chatRoutes.js
│   ├── .env                         # Backend environment variables
│   ├── server.js                    # Express app entry point
│   └── package.json
│
└── README.md
```

---

## Getting Started

### Prerequisites

Ensure the following are installed on your machine:

- **Node.js** v18.0 or above
- **npm** v9.0 or above
- **Git**
- A **MongoDB** instance (local: `mongodb://localhost:27017` or MongoDB Atlas)
- A modern web browser (Chrome, Firefox, or Edge — 2022+)

### Environment Variables

#### Backend `.env`

Create a `.env` file inside the `backend/` directory:

```env
# Server
PORT=5000

# MongoDB
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/revogue?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_jwt_secret_key_here

# Cloudinary — Image Storage
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Google Gemini — AI Item Tagging
GEMINI_API_KEY=your_gemini_api_key

# Groq — AI Chatbot (Reva)
GROQ_API_KEY=your_groq_api_key
```

#### Frontend `.env`

Create a `.env` file inside the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000
```

> For production deployment, update `VITE_API_URL` to your live Render backend URL.

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/your-username/revogue.git
cd revogue
```

**2. Install backend dependencies**

```bash
cd backend
npm install
```

**3. Install frontend dependencies**

```bash
cd ../frontend
npm install
```

### Running Locally

**Start the backend server**

```bash
cd backend
npm run dev
# Server starts at http://localhost:5000
```

**Start the frontend development server**

```bash
cd frontend
npm run dev
# App opens at http://localhost:5173
```

Both servers must be running simultaneously. The frontend communicates with the backend via the `VITE_API_URL` environment variable.

---

## Deployment

Revogue is deployed across four cloud services. The following steps reproduce the production deployment.

### 1. MongoDB Atlas — Database

1. Create a free account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a new **M0 free-tier cluster**
3. Add a database user with read/write access
4. Whitelist IP `0.0.0.0/0` (required for Render, whose outbound IP changes)
5. Copy the connection string — this becomes `MONGO_URI`

### 2. Cloudinary — Media Storage

1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. Navigate to **Dashboard** to retrieve your Cloud Name, API Key, and API Secret
3. Add these three values to the backend environment variables

### 3. Render — Backend Hosting

1. Create a free account at [render.com](https://render.com)
2. Create a new **Web Service** and connect your GitHub repository
3. Set the **Root Directory** to `backend`
4. Set **Build Command** to `npm install`
5. Set **Start Command** to `node server.js`
6. Add all backend environment variables under **Environment**
7. Deploy — Render provides a live URL (e.g. `https://revogue-api.onrender.com`)

### 4. Netlify — Frontend Hosting

1. Create a free account at [netlify.com](https://netlify.com)
2. Connect your GitHub repository
3. Set **Base Directory** to `frontend`
4. Set **Build Command** to `npm run build`
5. Set **Publish Directory** to `frontend/dist`
6. Add environment variable: `VITE_API_URL=https://your-render-url.onrender.com`
7. Deploy — Netlify provides a live URL and auto-deploys on every push to `main`

---

## API Endpoints

All protected routes require the header: `Authorization: Bearer <token>`

### Authentication — `/api/users`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/users/register` | ❌ | Register a new user account |
| POST | `/api/users/login` | ❌ | Login and receive JWT |
| POST | `/api/users/forgot-password` | ❌ | Request password reset token |
| PUT | `/api/users/reset-password` | ❌ | Reset password with token |
| GET | `/api/users/profile` | ✅ | Get own profile |
| PUT | `/api/users/profile` | ✅ | Update own profile |
| POST | `/api/users/profile/picture` | ✅ | Upload profile picture |

### Items — `/api/items`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/items` | ✅ | Upload a new item listing |
| POST | `/api/items/analyze-image` | ✅ | AI tagging — analyse image with Gemini |
| GET | `/api/items` | ❌ | Get all available items (supports `?category=&search=`) |
| GET | `/api/items/my-items` | ✅ | Get own item listings |
| GET | `/api/items/:id` | ❌ | Get single item by ID |
| PUT | `/api/items/:id` | ✅ | Edit own item |
| DELETE | `/api/items/:id` | ✅ | Delete own item |

### Swaps — `/api/swaps`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/swaps` | ✅ | Send a new swap request |
| GET | `/api/swaps` | ✅ | Get own swaps (sent + received) |
| PUT | `/api/swaps/:id/accept` | ✅ | Accept a swap request |
| PUT | `/api/swaps/:id/decline` | ✅ | Decline a swap request |
| DELETE | `/api/swaps/:id` | ✅ | Cancel a pending swap request |

### Messages — `/api/messages`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/messages` | ✅ | Send a message within an accepted swap |
| GET | `/api/messages/:swapId` | ✅ | Get all messages for a given swap |

### Notifications — `/api/notifications`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/notifications` | ✅ | Get all notifications for logged-in user |
| GET | `/api/notifications/unread-count` | ✅ | Get unread notification count |
| PUT | `/api/notifications/mark-read` | ✅ | Mark all notifications as read |

### Feedback — `/api/feedback`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/feedback` | ✅ | Submit a review |
| GET | `/api/feedback` | ❌ | Get all reviews |
| PUT | `/api/feedback/:id` | ✅ | Edit own review |
| DELETE | `/api/feedback/:id` | ✅ | Delete own review |

### Admin — `/api/admin` *(Admin role required)*

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/admin/stats` | ✅ Admin | Platform statistics |
| GET | `/api/admin/users` | ✅ Admin | List all users |
| DELETE | `/api/admin/users/:id` | ✅ Admin | Delete a user |
| GET | `/api/admin/items` | ✅ Admin | List all items |
| DELETE | `/api/admin/items/:id` | ✅ Admin | Delete an item |
| GET | `/api/admin/swaps` | ✅ Admin | List all swaps |

### Sustainability — `/api/sustainability`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/sustainability` | ❌ | Platform-wide sustainability metrics |
| GET | `/api/sustainability/personal` | ✅ | Personal sustainability contribution |

### Chat — `/api/chat`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/chat` | ❌ | Send message to Reva chatbot; receive AI reply |

---

## Database Schema

### User
```js
{
  name:        String (required),
  email:       String (required, unique),
  password:    String (required, hashed — bcrypt salt 10),
  profilePic:  String (Cloudinary URL),
  role:        String (enum: ['user', 'admin'], default: 'user'),
  timestamps:  true
}
```

### Item
```js
{
  owner:       ObjectId (ref: User, required),
  title:       String (required),
  description: String,
  category:    String (enum: ['T-Shirt', 'Jeans', 'Dress', 'Jacket', 'Shoes', 'Accessories', 'Sportswear', 'Formal Wear']),
  condition:   String (enum: ['New', 'Like New', 'Good', 'Fair']),
  size:        String (enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size']),
  material:    String,
  colour:      String,
  style:       String,
  images:      [String] (Cloudinary URLs),
  status:      String (enum: ['available', 'pending', 'swapped'], default: 'available'),
  timestamps:  true
}
```

### Swap
```js
{
  requester:     ObjectId (ref: User, required),
  receiver:      ObjectId (ref: User, required),
  requestedItem: ObjectId (ref: Item, required),
  offeredItem:   ObjectId (ref: Item, required),
  status:        String (enum: ['pending', 'accepted', 'declined', 'cancelled'], default: 'pending'),
  message:       String,
  timestamps:    true
}
```

### Message
```js
{
  swap:       ObjectId (ref: Swap, required),
  sender:     ObjectId (ref: User, required),
  text:       String (required),
  timestamps: true
}
```

### Notification
```js
{
  recipient:  ObjectId (ref: User, required),
  type:       String (enum: ['swap_request', 'swap_accepted', 'swap_declined', 'swap_cancelled', 'new_message']),
  message:    String,
  isRead:     Boolean (default: false),
  swap:       ObjectId (ref: Swap),
  timestamps: true
}
```

### Feedback
```js
{
  user:       ObjectId (ref: User, required),
  text:       String (required),
  rating:     Number (min: 1, max: 5, required),
  timestamps: true
}
```

---

## AI Features

### Automated Item Tagging — Google Gemini 2.5 Flash

When a user uploads a photograph on the item listing page, the image is immediately sent to the backend AI endpoint before any other fields are completed.

**Flow:**
1. User selects or drops image file → frontend sends `POST /api/items/analyze-image`
2. Backend reads the file buffer, encodes to base64, sends to Gemini API with a structured prompt
3. Gemini returns a JSON object with inferred values for: `title`, `description`, `category`, `condition`, `size`, `material`, `colour`, `style`
4. Backend validates enumerated fields against the permitted schema values
5. Frontend populates form fields; AI-filled fields highlighted in green
6. User reviews, edits if needed, then submits the full listing

**Prompt approach:** Temperature set to `0.1` for maximum consistency. The system prompt specifies exact JSON schema and acceptable enum values to ensure schema compatibility.

**Limitations:** Reduced accuracy for multi-item photographs, unusual lighting, or complex backgrounds. Works best with single item on a neutral background.

---

### Reva AI Chatbot — Groq / LLaMA 3.3 70B

Reva is a floating assistant widget accessible on every page of the application.

**Capabilities:**
- Explain how the swap workflow operates
- Guide users through item upload and AI tagging
- Answer questions about sustainable fashion and environmental impact
- Share sustainability facts grounded in the platform's impact data
- Assist with account and profile management queries

**Implementation:** Full conversation history is transmitted to the backend on each message, maintaining context across the session. The system prompt defines Reva's persona, platform knowledge, and scope boundaries.

---

## Sustainability Dashboard

The sustainability analytics dashboard calculates environmental impact metrics from all accepted swap records in the database, using category-level impact values derived from peer-reviewed academic literature.

### Impact Values by Category

| Category | CO₂ Saved (kg) | Water Saved (L) | Est. Value (£) |
|---|---|---|---|
| T-Shirt | 4.0 | 2,700 | 15 |
| Jeans | 33.4 | 7,000 | 30 |
| Dress | 8.0 | 3,500 | 35 |
| Jacket | 12.0 | 4,000 | 50 |
| Shoes | 9.0 | 2,000 | 40 |
| Accessories | 2.0 | 500 | 20 |
| Sportswear | 5.5 | 2,000 | 25 |
| Formal Wear | 15.0 | 5,000 | 60 |

**Sources:** Niinimäki et al. (2020); Ellen MacArthur Foundation (2017); Chapagain et al. (2006); ThredUp (2023)

### Dashboard Features
- **Platform-wide totals:** CO₂ saved, water saved, financial value exchanged
- **Interactive PieChart:** Category breakdown of swapped items (Recharts)
- **Category filter:** Select/deselect categories to isolate contributions
- **Personal impact panel:** Individual user's contribution metrics

---

## Testing

A suite of 22 functional test cases was executed against the implemented system.

**Result: 22/22 passed — 100% pass rate** *(minimum target: 90%)*

### Test Coverage Areas

| Area | Test Cases | Result |
|---|---|---|
| User Authentication | TC01 – TC05 | ✅ All Pass |
| Item Management & AI Tagging | TC06 – TC10 | ✅ All Pass |
| Swap Lifecycle | TC11 – TC14 | ✅ All Pass |
| Messaging | TC15 – TC16 | ✅ All Pass |
| Notifications | TC17 | ✅ Pass |
| Admin & Access Control | TC18 – TC19 | ✅ All Pass |
| Sustainability & Chatbot | TC20 – TC22 | ✅ All Pass |

### Testing Approach
- **Functional testing:** Manual test scenarios derived from defined requirements
- **Usability testing:** Structured task-based sessions with 5 volunteer participants
- **Performance testing:** Chrome DevTools Network panel; standard operations < 3s
- **AI feature evaluation:** Range of image types across 8 categories

---

## Screenshots

> UI screenshots are available in the deployed live application. Key interfaces include:

| Page | Description |
|---|---|
| **Homepage** | Hero section, featured items, sustainability stats, Reva chatbot widget |
| **Items Browse** | Responsive card grid, real-time keyword search, category filter |
| **Upload Item** | AI tagging interface with green-highlighted auto-populated fields |
| **Swap Requests** | Sent/received tab panels, action buttons, discussion modal |
| **Sustainability Dashboard** | Metric tiles, interactive PieChart, category filter, personal impact panel |
| **Admin Dashboard** | Platform statistics, user/item/swap management tables |

---

## Academic Information

| Field | Detail |
|---|---|
| **Project Title** | Revogue — Fashion Swap Platform |
| **Module** | PUSL3190 Computing Project |
| **Degree** | BSc (Hons) Computer Science |
| **Institution** | NSBM Green University / University of Plymouth |
| **Academic Year** | 2024 – 2025 |
| **Student Name** | Baladurage I Imasha |
| **Plymouth Index** | 10953702 |
| **Supervisor** | Ms. Thisarani Wickramasinghe |

### Key References

- Niinimäki, K. et al. (2020) 'The environmental price of fast fashion', *Nature Reviews Earth and Environment*, 1(4), pp. 189–200.
- Ellen MacArthur Foundation (2017) *A new textiles economy: Redesigning fashion's future.*
- Chapagain, A.K. et al. (2006) 'The water footprint of cotton consumption', *Ecological Economics*, 60(1), pp. 186–203.
- ThredUp (2023) *2023 Resale Report.*

---

## Author

**Baladurage I Imasha**  
BSc (Hons) Computer Science  
NSBM Green University | University of Plymouth  
Plymouth Index: 10953702

---

*Revogue was built as a final-year academic project to demonstrate that sustainable fashion technology can be practically designed, implemented, and deployed within a single development cycle. Every swap on Revogue is a step away from textile waste.*