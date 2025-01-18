# Gearly Server

This is the back-end of my full stack e-commerce application named Gearly. This project is built using the MERN stack (MongoDB, Express.js, React, Node.js).

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features

- Role-based authentication (Admin and Customers)
- User management
- Category management
- Product management
- Additional roles and features are planned for future releases.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Shahriar090/Gearly-Server
   ```
2. Navigate to the project directory:
   ```bash
   cd gearly-server
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory and add your environment variables:
   ```env
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```

## Usage

1. Start the dev server:
   ```bash
   npm run start:dev
   ```
2. The server will be running on `http://localhost:7000`.

## API Endpoints

- **Authentication**

  - `POST /api/v1/auth/login` - Log in a user
  - `POST /api/v1/auth/logout` - Log out a user

- **Users**

  - `POST /api/v1/users/register` - Create a user
  - `GET /api/v1/users` - Get all users (Admin only)
  - `GET /api/v1/users/:id` - Get user by ID
  - `PUT /api/v1/users/:id` - Update user by ID
  - `DELETE /api/v1/users/:id` - Delete user by ID

- **Categories**

  - `GET /api/v1/categories` - Get all categories
  - `POST /api/v1/categories` - Create a new category (Admin only)
  - `PUT /api/v1/categories/:id` - Update category by ID (Admin only)
  - `DELETE /api/v1/categories/:id` - Delete category by ID (Admin only)

- **Products**
  - `GET /api/v1/products` - Get all products
  - `POST /api/v1/products` - Create a new product (Admin only)
  - `PUT /api/v1/products/:id` - Update product by ID (Admin only)
  - `DELETE /api/v1/products/:id` - Delete product by ID (Admin only)

## Contributing

Please fork this repository, create a new branch for your changes, and submit a pull request.

## License

This project is licensed under the MIT License.
