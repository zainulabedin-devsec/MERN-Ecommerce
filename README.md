# 🛒 MERN Ecommerce

A full-stack **MERN Stack Ecommerce Platform** built with **MongoDB, Express.js, React, and Node.js**.

The application provides a complete ecommerce experience with customer authentication, product browsing, shopping cart management, order placement, order tracking, admin order management, Cloudinary image storage, and automated email notifications.

## 🚀 Live Demo

**Frontend:**
mern-ecommerce-frontend-two-navy.vercel.app

**Backend:**
Deployed backend API

> The live application uses a deployed React frontend and Node.js/Express backend connected to MongoDB Atlas.

---

## 📌 Features

### 👤 Customer Features

* User registration and login
* JWT-based authentication
* Secure password hashing with bcrypt
* Browse products
* Product categories
* Product search
* Product filtering
* Product sorting
* Product price filtering
* Product details
* Product reviews and ratings
* Shopping cart
* Quantity management
* Stock validation
* Checkout
* Shipping address management
* Cash on Delivery (COD)
* Order placement
* Order history
* Order details
* Order status tracking
* Automated order confirmation emails

### 🔐 Authentication & Security

* JWT authentication
* Protected routes
* Role-based admin authorization
* Password hashing with bcrypt
* HTTP security headers using Helmet
* API rate limiting
* CORS configuration
* Input validation
* Secure environment variables
* Cookie handling
* Request logging

### 🛠️ Admin Features

* Admin dashboard
* View all customer orders
* Search orders
* Filter orders by status
* View customer information
* View shipping information
* View payment information
* View ordered products
* Update order status
* Cancel orders
* Restore product stock after cancellation
* Delete orders
* Revenue statistics
* Order statistics
* Automated customer status-update emails

### 🖼️ Product Management

* Product creation
* Product information management
* Product categories
* Product pricing
* Sale pricing
* Stock management
* New arrival products
* Product images
* Cloudinary image storage

### 📧 Email Notifications

The application uses **Nodemailer** to send automated emails for:

* Order confirmation
* Order status updates
* Customer notifications
* Admin order notifications

---

## 🧰 Tech Stack

### Frontend

* React.js
* Vite
* JavaScript
* Tailwind CSS
* Axios
* React Hooks

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* Nodemailer
* Cloudinary
* Multer
* Helmet
* Morgan
* Compression
* Express Rate Limit
* Express Validator
* Cookie Parser
* CORS

### Database

**MongoDB Atlas**

### Image Storage

**Cloudinary**

### Deployment

* Frontend: Vercel
* Backend: Node.js hosting platform
* Database: MongoDB Atlas

---

## 🏗️ Project Architecture

```text
                    ┌──────────────────────┐
                    │      React App       │
                    │   Vite + Tailwind    │
                    └──────────┬───────────┘
                               │
                               │ Axios / REST API
                               ▼
                    ┌──────────────────────┐
                    │    Express.js API    │
                    │      Node.js         │
                    └──────────┬───────────┘
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
             ▼                 ▼                 ▼
      ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
      │ MongoDB     │   │ Cloudinary  │   │  Nodemailer │
      │   Atlas     │   │   Images    │   │    Email    │
      └─────────────┘   └─────────────┘   └─────────────┘
```

---

## 📂 Project Structure

```text
MERN-Ecommerce/
│
├── FrontEnd/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── ...
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── BackEnd/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── seed/
│   ├── server.js
│   └── package.json
│
├── .gitignore
├── LICENSE
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/zainulabedin-devsec/MERN-Ecommerce.git
```

```bash
cd MERN-Ecommerce
```

---

# 🔙 Backend Setup

Navigate to the backend directory:

```bash
cd BackEnd
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

Start the development server:

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

---

# 🎨 Frontend Setup

Open another terminal and navigate to the frontend:

```bash
cd FrontEnd
```

Install dependencies:

```bash
npm install
```

Configure your API URL according to your environment.

For local development:

```text
http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

---

## 🔑 Environment Variables

Never commit your actual `.env` file.

Sensitive information such as:

* MongoDB credentials
* JWT secrets
* Cloudinary API credentials
* Email passwords
* API keys

should be stored in environment variables.

Example:

```env
MONGO_URI=your_database_url
JWT_SECRET=your_secret
CLOUDINARY_API_SECRET=your_secret
EMAIL_PASS=your_password
```

---

## 🔄 Order Flow

```text
Customer
   │
   ▼
Add Product
   │
   ▼
Shopping Cart
   │
   ▼
Checkout
   │
   ▼
Create Order
   │
   ├──────────────► MongoDB
   │
   ├──────────────► Reduce Product Stock
   │
   └──────────────► Send Confirmation Email
                         │
                         ▼
                    Customer + Admin
```

### Order Status Flow

```text
Processing
     │
     ▼
Confirmed
     │
     ▼
Shipped
     │
     ▼
Delivered
```

An order can also be cancelled according to the application's business rules.

When an order is cancelled, product stock is restored.

---

## 🛡️ Security

The backend implements several security measures:

* JWT authentication
* Password hashing
* Protected admin routes
* Role-based authorization
* Helmet security headers
* Rate limiting
* CORS configuration
* Request validation
* Environment-based secrets
* Secure API architecture

---

## 🎯 Learning Objectives

This project was developed to demonstrate practical experience with:

* Full-stack JavaScript development
* REST API development
* React frontend architecture
* Express.js backend development
* MongoDB database design
* Authentication and authorization
* JWT
* CRUD operations
* API integration
* Cloudinary
* Email automation
* Admin dashboards
* Order management
* Stock management
* Backend security
* Deployment

---

## 🔮 Future Improvements

Potential future improvements include:

* Online payment integration
* Stripe/JazzCash/EasyPaisa payments
* Product pagination
* Advanced analytics dashboard
* Sales charts
* Wishlist
* Coupon system
* Product recommendations
* Advanced admin product management
* Customer profile management
* Order invoice generation
* Docker deployment
* Automated CI/CD pipeline

---

## 👨‍💻 Author

**Zain Ul Abedin**

Computer Science Student | Full-Stack Developer | Cybersecurity Enthusiast

GitHub:
https://github.com/zainulabedin-devsec

---

## 📄 License

This project is licensed under the **MIT License**.

