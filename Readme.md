# Kemet

![Next.js](https://img.shields.io/badge/Next.js-black?logo=next.js&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-5.x-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![License](https://img.shields.io/badge/license-All_Rights_Reserved-red)

Kemet is a comprehensive travel platform that seamlessly connects travelers with unique trips, hidden gems, and essential booking services like flights and hotels.

## 1. Project Overview

**Purpose:**  
Kemet aims to centralize and simplify the travel planning process, providing a one-stop-shop for managing trips, exploring curated content, and handling reservations.

**Problem it Solves:**  
Travelers often struggle with fragmented booking experiences—having to use separate applications for flights, hotels, reading travel blogs, and discovering local spots. Kemet solves this by integrating all these features into a single, cohesive ecosystem.

**Target Users:**

- **Travelers/Users:** Looking to book trips, search flights and hotels, read travel blogs, and discover hidden gems.
- **Travel Guides:** Managing their offerings, leading trips, and utilizing specialized guide dashboards.
- **Administrators:** Overseeing platform content, managing users, sending newsletters, and monitoring bookings.

**Main Features & Functionality:**

- Full trip and booking management.
- Live flight and hotel searches (via Amadeus and Makcorps APIs).
- Secure user authentication (JWT, Google OAuth) and role-based access control.
- Integrated Stripe payments for trip checkout.
- Content management for blogs, travel offerings, and hidden gems.

## 2. Features

- **Authentication & Authorization:** Secure JWT login, refresh tokens, Google OAuth 2.0, and role-based permissions (`admin`, `user`, `guide`).
- **Travel Booking Engine:** Search and price flights and hotels directly on the platform.
- **Secure Payments:** End-to-end booking checkout and refund handling via Stripe integration.
- **Rich Content Platform:** Explore integrated travel blogs, local hidden gems, and travel offerings.
- **Passport Image Validation:** Built-in passport image upload and validation using Cloudinary and Sharp.
- **Dashboards:** Dedicated portals for Users, Admins, and Guides to manage their specific activities.
- **Communication:** Automated transactional emails and newsletter subscriptions.

## 3. Tech Stack

| Category            | Technology                           |
| ------------------- | ------------------------------------ |
| **Frontend**        | Next.js, React, FontAwesome          |
| **Backend Runtime** | Node.js                              |
| **Web Framework**   | Express.js                           |
| **Database**        | MongoDB & Mongoose                   |
| **Authentication**  | JWT, Passport.js (Google OAuth)      |
| **Payments**        | Stripe                               |
| **External APIs**   | Amadeus (Flights), Makcorps (Hotels) |
| **File Storage**    | Cloudinary, Multer, Sharp            |

## 4. Frontend Summary

The frontend is built with **Next.js**, leveraging React's modern component-based architecture for building a fast, interactive, and SEO-friendly user interface.

- **Responsibilities:** It handles the presentation layer, consuming the backend RESTful API to display available trips, flight search forms, and hotel listings. It manages user sessions on the client side, provides intuitive dashboards for different user roles, and incorporates responsive designs optimized with custom web fonts.
- **Communication:** Interacts with the backend via standard HTTP requests, relying on HTTP-only cookies for secure session management and authentication verification.

## 5. Backend Summary

The backend is a robust RESTful API built on **Node.js** and **Express.js**, connected to a **MongoDB** database.

- **Responsibilities:** It acts as the brain of the platform, handling all core business logic including user authentication, Stripe payment processing, secure file uploads via Cloudinary, and data persistence.
- **Integrations:** It acts as a secure proxy to third-party providers (Amadeus, Makcorps), ensuring that sensitive API keys are kept safe while delivering real-time flight and hotel data to the frontend.
- **Security:** Protected by Helmet, CORS, express-rate-limit, and robust error handling middleware to ensure a reliable and secure environment.

## 6. Project Structure

The repository is organized into two main workspaces:

```bash
Kemet/
├── Back-end/                # Node.js / Express API
│   ├── config/              # Database, 3rd party API & Cloudinary configs
│   ├── controller/          # Business logic (Auth, Bookings, Dashboards)
│   ├── docs/                # Swagger API documentation
│   ├── middleware/          # JWT auth, role checks, upload validation
│   ├── model/               # Mongoose schemas (Users, Trips, Bookings, etc.)
│   ├── routes/              # Express API endpoints
│   ├── services/            # Token generation, external APIs, emails
│   └── server.js            # Entry point
│
├── front-end/               # Next.js Application
│   ├── pages/               # Next.js page components and API routes
│   ├── public/              # Static assets
│   ├── styles/              # Global styles and CSS modules
│   ├── package.json         # Frontend dependencies
│   └── next.config.js       # Next.js configuration
└── README.md
```

## 7. Installation & Setup

### Prerequisites

- Node.js (v20+)
- MongoDB (Local instance or Atlas URI)
- Git

### Clone the repository

```bash
git clone https://github.com/your-username/Kemet.git
cd Kemet
```

### Setup Backend

```bash
cd Back-end
npm install
```

### Setup Frontend

```bash
cd ../front-end
npm install
```

## 8. Environment Variables

You will need to set up environment variables for both the backend and frontend.

### Backend (`Back-end/.env`)

Create a `.env` file in the `Back-end/` directory:

```env
PORT=8000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/kemet

# Authentication Secrets
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
RESET_PASSWORD_SECRET=your_reset_password_secret

# Platform URLs
DOMAIN=http://localhost:3000
BACKEND_URL=http://localhost:8000

# Third-party Credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:8000/api/auth/google/callback

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

AMADEUS_CLIENT_ID=your_amadeus_client_id
AMADEUS_CLIENT_SECRET=your_amadeus_client_secret
HOTEL_MAKCORPS_KEY=your_hotel_api_key
FLIGHT_API_KEY=your_flight_api_key
```

### Frontend (`front-end/.env.local`)

Create a `.env.local` file in the `front-end/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## 9. Running the Project

To run the platform locally, you will need to start both servers in separate terminal windows.

**Start the Backend API:**

```bash
cd Back-end
npm run dev
```

_The API will be available at `http://localhost:8000`_

**Start the Frontend Web App:**

```bash
cd front-end
npm run dev
```

_The UI will be available at `http://localhost:3000`_

## 10. Future Improvements

- Implement automated testing (Unit and Integration tests) for both backend and frontend.
- Introduce CI/CD pipelines for automated deployment.
- Add real-time notifications for booking confirmations and updates using WebSockets.
- Containerize the application using Docker and Docker Compose for easier onboarding.
- Implement data validation libraries (like Zod or Joi) on the backend.

## 11. Contributors

### Backend Team

- **Amr Assal**
- **Mahmoud Hazem Shahtout**

### Frontend Team

- **Youssef Yeser** — Team Lead
- **Shahd Mahmoud**
- **Ahmed Khaled**

## 12. License & Usage Restrictions

**Copyright (c) 2026 Amr Assal, Mahmoud Hazem Shahtout, Youssef Yeser, Shahd Mahmoud, and Ahmed Khaled. All Rights Reserved.**

This project was developed as an academic graduation project, and all intellectual property remains with the authors. The source code is published strictly for **portfolio, demonstration, and evaluation purposes only**.

You are explicitly prohibited from:

- Commercial use.
- Redistribution or republishing.
- Copying substantial portions of the code.
- Creating derivative works.
- Using the project in academic submissions.
- Using the code, data, or assets for AI/ML training datasets.

Anyone wishing to use, modify, distribute, or build upon this project must obtain **prior written permission** from the project owners. For more details, please see the [LICENSE](LICENSE) file.
