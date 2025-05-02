# Ecommerce Fullstack App

A modern, full-stack ecommerce application built with React and Express.

![ShopWave Screenshot](./screenshots/homepage.png)

## 🚀 Features

- **Product Browsing**: Browse products with filtering and sorting options
- **Shopping Cart**: Add/remove items, adjust quantities, and checkout
- **User Authentication**: Secure login/signup 
- **User Profiles**: View order history and manage account details
- **Admin Dashboard**: Manage products, categories, and view orders
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React 19**: Latest React with hooks and concurrent features
- **React Router 7**: For client-side routing
- **Axios**: For API requests
- **CSS Modules**: For component-scoped styling

### Backend
- **Express 5**: Fast, unopinionated web framework for Node.js
- **SQLite3**: Lightweight SQL database
- **JWT**: For secure authentication
- **bcrypt**: For password hashing

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn


## 📝 API Documentation

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/products` | GET | Get all products |
| `/api/products/:id` | GET | Get product by ID |
| `/api/auth/login` | POST | User login |
| `/api/auth/register` | POST | User registration |
| `/api/cart` | GET | Get user's cart |
| `/api/cart` | POST | Add item to cart |

## 👏 Acknowledgements

- [React](https://reactjs.org/)
- [Express](https://expressjs.com/)
- [Vite](https://vitejs.dev/)
- [SQLite](https://www.sqlite.org/)

