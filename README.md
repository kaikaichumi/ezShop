# ezShop - Simple E-commerce Platform

ezShop is a lightweight e-commerce platform built with Node.js and Vue.js, perfect for beginners learning full-stack development. This project includes all essential e-commerce features, including user registration and authentication, product browsing, shopping cart functionality, order processing, and administrator capabilities.

## Technology Stack

### Backend
- Node.js
- Express.js - Web server framework
- Firebase Firestore - Database
- JWT - User authentication
- bcryptjs - Password encryption

### Frontend
- Vue.js 3 - Frontend framework
- Vue Router - Route management
- Pinia - State management
- Bootstrap 5 - UI framework
- Axios - HTTP client

## Features

### User Features
- User registration and login
- Product browsing
- Product search
- Product reviews and ratings
- Shopping cart management
- Order creation and checkout
- Payment system simulation
- Order history viewing
- Profile management

### Admin Features
- Product management (CRUD operations)
- User management
- Order management
- Order shipment tracking

## Installation and Setup

### Prerequisites
- Node.js (v14+)
- Firebase account

### Firebase Setup
1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project
2. Select "Firestore Database" from the "Build" menu and create a database
3. In "Project Settings," select "Service Accounts" and generate a new private key. This will download a JSON file containing your Firebase Admin SDK configuration
4. Store the contents of this JSON file in an environment variable, or temporarily use it in `backend/config/firebase.js` (development environment only)

### Development Mode
For convenience, the system provides a simulated Firestore service that automatically activates when you haven't configured real Firebase credentials. This allows you to quickly start development without immediately setting up a Firebase project.

**Simulation Mode Notes**:
- All data is stored in memory only and will be lost when the server restarts
- Complex query functions are not supported
- Only for development and testing, not suitable for production environments

### Setup Steps

1. Clone or download the project

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd frontend
npm install
```

4. Configure environment variables
   - Backend: Set your JWT key in the `backend/.env` file
   - Firebase: Configure your Firebase project according to the steps above

5. Run the backend server
```bash
cd backend
npm run dev
```

6. Run the frontend server
```bash
cd frontend
npm run dev
```

7. Open your browser and visit http://localhost:3000

## Project Structure

```
ezShop/
│
├── backend/              # Backend code
│   ├── config/           # Configuration files
│   ├── controllers/      # Controllers
│   ├── middleware/       # Middleware
│   ├── routes/           # API routes
│   ├── uploads/          # Uploaded files
│   ├── utils/            # Utility functions
│   ├── .env              # Environment variables
│   ├── package.json      # Dependency configuration
│   └── server.js         # Main entry file
│
├── frontend/             # Frontend code
│   ├── public/           # Static resources
│   ├── src/              # Source code
│   │   ├── api/          # API services
│   │   ├── assets/       # Static assets
│   │   ├── components/   # Shared components
│   │   ├── router/       # Route configuration
│   │   ├── stores/       # Pinia state stores
│   │   ├── views/        # Page components
│   │   ├── App.vue       # Root component
│   │   └── main.js       # Main entry file
│   ├── package.json      # Dependency configuration
│   └── vite.config.js    # Vite configuration
│
└── README.md             # Project documentation
```

## Firestore Data Structure

This project uses three main collections:

1. **users** - Stores user information
   - Fields: name, email, password (encrypted), isAdmin, createdAt, updatedAt

2. **products** - Stores product information
   - Fields: name, price, image, brand, category, countInStock, description, rating, numReviews, reviews (array), user (creator ID), createdAt, updatedAt

3. **orders** - Stores order information
   - Fields: user (user ID), orderItems (array), shippingAddress (object), paymentMethod, paymentResult (object), itemsPrice, taxPrice, shippingPrice, totalPrice, isPaid, paidAt, isDelivered, deliveredAt, createdAt, updatedAt

## Learning Highlights

- Firebase Firestore database operations
- RESTful API design and implementation
- JWT authentication and authorization
- State management (Pinia)
- Vue components and routing
- Frontend-backend separation architecture
- Error handling

## Notes

- This project uses Firebase Firestore instead of MongoDB, which eliminates the extra cost of database server deployment
- Firebase's free tier is sufficient for small applications, providing a daily allowance of read/write/delete operations
- When deploying to a production environment, ensure you properly secure your Firebase credentials, preferably using environment variables rather than hardcoding

## Extension Suggestions

- Implement real payment gateway integration
- Add product image upload functionality (using Firebase Storage)
- Implement search and filtering functions
- Add wishlist functionality
- Add inventory management functionality
- Multi-language support
- Mobile responsive design optimization
- Add order tracking functionality
- Integrate Firebase Authentication for third-party login

## Admin Account Setup

Since the system requires an admin account to manage products and users, you need to create an admin user:

1. **Register a regular user**
   - Open your browser and visit http://localhost:3000
   - Click "Register" and create a new account

2. **Upgrade the user to an admin**
   - Open your Firestore database in the Firebase console
   - Find the "users" collection
   - Locate the user document you just created
   - Edit the "isAdmin" field and change its value to `true`
   - Save the changes

## Deployment Guide

When you're ready to deploy the application to a production environment, consider these options:

### Frontend Deployment
- **Firebase Hosting**: The simplest choice, on the same platform as your Firestore database
- **Vercel/Netlify**: Offers free and paid plans, easy to set up
- **Cloud service providers**: Such as GCP, AWS, Azure, etc.

### Backend Deployment
- **Cloud Functions for Firebase**: If you prefer to stay within the Firebase ecosystem
- **Cloud Run (GCP)**: Suitable for situations requiring more control
- **App Engine (GCP)**: Suitable for applications requiring high scalability
- **Other cloud service providers**: AWS, Azure, Heroku, etc.

### Important Security Tips
- Always use environment variables to store sensitive information in production environments
- Configure appropriate Firestore security rules to protect your data
- Consider enabling additional Firebase services, such as Authentication, Storage, etc., to enhance functionality

## License

MIT