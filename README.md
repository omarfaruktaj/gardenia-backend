# Gardenia - Backend

This is the **backend** code for the Gardening Tips & Advice Platform, a full-stack web application for gardening enthusiasts to share and discover gardening knowledge. The backend provides API endpoints for user authentication, post creation, commenting, upvoting, payment integration, and more. It is built using **Node.js, Express, MongoDB, and JWT for authentication**.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Project](#running-the-project)

## Features

- **User Authentication**: JWT-based user authentication for login, registration, and profile management.
- **Post Creation & Sharing**: APIs to create, edit, delete, and fetch posts with rich content.
- **Comments & Upvotes**: Engage with content through a fully functional comment and upvote system.
- **Premium Content Access**: Payment integration using **Aamarpay/Stripe** for premium content access.
- **Admin Dashboard**: APIs for managing users, posts, and payments.
- **Search & Filtering**: Search and filter posts based on categories, popularity, and more.

## Tech Stack

- **Node.js**: JavaScript runtime for building the server-side.
- **Express.js**: Web framework for Node.js, handling routing and API logic.
- **MongoDB**: NoSQL database for storing users, posts, comments, and payment records.
- **Mongoose**: Object Data Modeling (ODM) library for MongoDB.
- **JWT (JSON Web Tokens)**: For secure user authentication and session management.
- **Stripe / Aamarpay**: Payment gateway integrations for premium content.
- **Swagger**: API documentation using **OpenAPI** standard.

## Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** (v14.x or higher) & npm (v6.x or higher)
- **MongoDB** (running locally or via a cloud provider like MongoDB Atlas)

## Instructions

To set up and run this project locally, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/omarfaruktaj/gardenia-backend.git
   cd gardenia-backend
   ```

2. **Install dependencies:**

   ```bash
   yarn install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and add the necessary environment variables:

   ```plaintext
    PORT=5000

    # database
    MONGO_URI= db url

    # JWT
    ACCESS_TOKEN_SECRET= secret
    ACCESS_TOKEN_EXPIRE=1d

    REFRESH_TOKEN_SECRET=secret
    REFRESH_TOKEN_EXPIRE=7d

    NODE_ENV=production

    STRIPE_SECRET_KEY= stripe secret key

    # EMAIL (for dev)
    EMAIL_HOST=smtp.ethereal.email
    EMAIL_PORT=587
    EMAIL_USERNAME=maddison53@ethereal.email
    EMAIL_PASSWORD=jn7jnAPss4f63QBp6D
    EMAIL_FROM=gardenia@mail.com

    RESET_TOKEN_CLIENT_URL= http://localhost:3000/reset-password


    CLOUDINARY_CLOUD_NAME= cloud name
    CLOUDINARY_API_KEY=api key
    CLOUDINARY_API_SECRET= api secret

    SENDER_EMAIL= gmail
    SENDER_APP_PASSWORD= google app password

   ```

4. **Start the development server:**

   ```bash
   yarn run dev
   ```

   The application should now be running at `http://localhost:5000`.

## Key Functionality

### User Authentication

- JWT-based authentication for secure login, registration, and session handling.
- Supports registration with email and password, including profile management.

### Rich Text Editor

- Users can create rich multimedia posts (text, images, videos) using the integrated editor.
- Supports formatting options like bold, italics, headings, lists, etc.

### Premium Content & Payment Integration

- Users can access premium gardening content by making payments through Stripe or Aamarpay.
- Payment status is linked to user verification, which unlocks exclusive features and content.

### Upvote & Comment System

- Engage with community posts by upvoting or downvoting content.
- Users can comment on posts and reply to other users (optional).

### Search & Filter

- Search for content by keywords, categories, and popularity.
- Filter posts by categories such as Vegetables, Flowers, Landscaping, and more.
