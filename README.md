# 🚗 EcoRide - Corporate Carpooling Platform

A comprehensive corporate carpooling and sustainability platform to reduce traffic pollution and promote environmental responsibility within corporate environments built with the MERN stack.

🔗 **Live Demo:** [https://ecoride-frontend-sigma.vercel.app/](https://ecoride-frontend-sigma.vercel.app/)

---

## 🚀 Features

- 🚘 **Ride Sharing** - Create and join carpool rides with detailed route information
- 🗺️ **Trip Planning** - Organize group trips with multiple participants and cost splitting
- 🛒 **Marketplace** - Buy and sell items within the corporate community
- 💬 **Real-time Chat** - Direct messaging and group conversations with unread badges
- 📊 **Analytics Dashboard** - Track CO₂ emissions saved, money saved, and ride statistics
- 🔔 **Smart Notifications** - Real-time alerts for ride requests, approvals, and updates
- 👤 **User Profiles** - Manage preferences, activity history, and environmental impact
- 🌍 **Environmental Impact** - Calculate and visualize contribution to sustainability

---

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Socket.io Client** - Real-time communication
- **Leaflet** - Interactive maps
- **Chart.js** - Data visualization

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Socket.io** - Real-time bidirectional events
- **bcrypt** - Password hashing

### Deployment
- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas

---

## 📁 Project Structure
```
ecoride-carpooling-platform/
├── frontend/                      # React frontend
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── RideCard.js
│   │   │   ├── TripCard.js
│   │   │   └── ItemCard.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── LoginPage.js
│   │   │   ├── RegisterPage.js
│   │   │   ├── DashboardPage.js
│   │   │   ├── RidesPage.js
│   │   │   ├── TripsPage.js
│   │   │   ├── MarketplacePage.js
│   │   │   ├── ChatPage.js
│   │   │   └── ProfilePage.js
│   │   ├── services/
│   │   │   └── api.js           # API service layer
│   │   ├── utils/
│   │   │   └── constants.js
│   │   ├── App.css              # Styles
│   │   ├── App.js               # Main application component
│   │   ├── index.css
│   │   └── index.js
│   ├── .gitignore
│   ├── package-lock.json
│   ├── package.json
│   └── README.md
│
├── backend/                       # Express backend
│   ├── node_modules/
│   ├── config/
│   │   └── db.js                # Database configuration
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── rideController.js
│   │   ├── tripController.js
│   │   ├── itemController.js
│   │   ├── chatController.js
│   │   └── dashboardController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/                  # MongoDB schemas
│   │   ├── User.js
│   │   ├── Ride.js
│   │   ├── Trip.js
│   │   ├── Item.js
│   │   ├── Chat.js
│   │   └── Notification.js
│   ├── routes/                  # API routes
│   │   ├── auth.js
│   │   ├── rides.js
│   │   ├── trips.js
│   │   ├── items.js
│   │   ├── chats.js
│   │   └── dashboard.js
│   ├── socket/
│   │   └── socketHandler.js     # Socket.io events
│   ├── .env
│   ├── .gitignore
│   ├── package-lock.json
│   ├── package.json
│   └── server.js                # Entry point
│
├── .gitignore
└── README.md
```

---

## 🏃‍♂️ How to Run Locally

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas account)
- npm or yarn

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Vaishhnavi27Hub/ecoride-carpooling-platform.git
cd ecoride-carpooling-platform
```

### 2️⃣ Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

Start the backend server:
```bash
npm start
```
Backend runs on `http://localhost:5000`

### 3️⃣ Frontend Setup
Open a new terminal:
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` folder:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

Start the frontend:
```bash
npm start
```
Frontend runs on `http://localhost:3000`

---

## 🎨 Features in Detail

### Dashboard
- Visual analytics with charts
- CO₂ emissions saved tracking
- Money saved calculations
- Trees equivalent display (1 tree = 10kg CO₂)
- Ride statistics (offered and taken)

### Rides Page
- Create rides with route details and vehicle information
- Smart filtering (Today, Tomorrow, This Week, Completed)
- Driver approval workflow for passenger requests
- Interactive maps with Leaflet
- Ride history with faded styling
- Real-time ride updates

### Trips Page
- Organize group trips with multiple participants
- Cost splitting functionality
- Participant management (confirmed/pending)
- Trip status tracking
- Join requests workflow

### Marketplace
- List items for sale with images and descriptions
- Category-based browsing
- Order management system
- Direct seller chat integration
- Edit and delete listings
- Responsive card layout

### Chat System
- Direct one-on-one messaging
- Group chat creation
- Real-time message delivery via Socket.io
- Unread message badges
- View group members with admin badges
- Delete conversations

### Profile Management
- Update personal information
- Set ride preferences (music, chattiness, smoking, pets)
- View activity summary
- Track environmental impact
- Inline preference editing

### Notifications
- Real-time ride request alerts
- Approval/rejection notifications
- Trip updates
- Marketplace order notifications
- Unread count badges

---

## 🌍 Environmental Impact Calculations

### CO₂ Savings
```
Solo Trip Emissions = Distance (km) × 0.12 kg CO₂/km
Shared Trip Emissions = Solo Emissions ÷ Number of Passengers
CO₂ Saved = Solo Emissions - Shared Emissions
```

### Money Savings
```
Solo Trip Cost = Distance (km) × Fuel Rate (₹/km)
Shared Trip Cost = Solo Cost ÷ Number of Passengers
Money Saved = Solo Cost - Shared Cost
```

### Trees Equivalent
```
Trees = CO₂ Saved (kg) ÷ 10 kg per tree
```

---

## 🔐 Authentication

- JWT-based secure authentication
- Company-specific email validation (@xyz.com)
- Token expiration (7 days)
- Protected routes on both frontend and backend
- Password hashing with bcrypt

---

## 📱 Responsive Design

- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interfaces
- Adaptive layouts with Tailwind CSS

---

## 🚀 Deployment

### Backend (Render)
1. Push code to GitHub
2. Create Web Service on Render
3. Connect repository
4. Set root directory to `backend`
5. Add environment variables
6. Deploy

### Frontend (Vercel)
1. Import project from GitHub
2. Set root directory to `frontend`
3. Add environment variables
4. Deploy

### Database (MongoDB Atlas)
1. Create cluster
2. Configure network access
3. Create database user
4. Get connection string

---



**Made with 💚 for a sustainable future**
