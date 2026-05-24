# Kemet Backend API

![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-5.x-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![License](https://img.shields.io/badge/license-ISC-blue)

Backend API for the Kemet travel platform, built with **Node.js**, **Express.js**, and **MongoDB**. It handles user authentication, trip management, bookings, hotel and flight search, payments, blogs, newsletters, dashboards, and image uploads.

This README is written to help both beginners and experienced developers understand the project quickly and run it with confidence. 🚀

## Project Description

Kemet Backend is a RESTful API for a travel application. It provides endpoints for:

- User registration, login, Google OAuth, email verification, and token refresh
- Trip, blog, offering, and hidden gem management
- Flight and hotel search
- Booking creation and cancellation
- Stripe payment checkout and webhook handling
- Newsletter subscription and email sending
- Dashboard endpoints for users, admins, and guides
- Swagger API documentation

The project follows a practical Express structure using routes, controllers, models, middleware, services, and config files.

## Features

- JWT authentication with HTTP-only cookies
- Refresh token flow
- Google sign-in with Passport.js
- Email verification and password reset
- MongoDB database integration with Mongoose
- Stripe payment integration
- Cloudinary image upload support
- Swagger API documentation
- Role-based authorization for `admin`, `user`, and `guide`
- Rate limiting for auth and API endpoints
- Helmet security headers
- Request logging with Morgan and Winston
- Image validation using Sharp and Multer

## Tech Stack

| Category | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Authentication | JWT, Passport.js, Google OAuth 2.0 |
| Payments | Stripe |
| File Uploads | Multer, Cloudinary, Sharp |
| Security | Helmet, CORS, express-rate-limit, cookie-parser |
| Logging | Morgan, Winston |
| API Docs | Swagger UI, swagger-jsdoc |
| Email | Nodemailer |
| Development | Nodemon, ESLint |

## Folder Structure

```bash
Back-end/
├── config/
│   ├── amadeus.js
│   ├── cloudinary.js
│   ├── db.js
│   ├── flightApi.js
│   └── hotelApi.js
├── controller/
│   ├── auth/
│   ├── BookingMgt/
│   ├── contentmgt/
│   └── Dashboards/
├── docs/
│   └── swagger.js
├── middleware/
│   ├── authenticate.js
│   ├── authorize.js
│   ├── ErrorMW.js
│   ├── multer.js
│   ├── PassportVarification.js
│   ├── passportImageValidation.js
│   ├── rateLimiter.js
│   └── morganMW.js
├── model/
│   ├── userSchema.js
│   ├── tripSchema.js
│   ├── BookingSchema.js
│   ├── blogSchema.js
│   ├── offeringSchema.js
│   ├── hiddenGemSchema.js
│   ├── guideSchema.js
│   ├── guestSchema.js
│   ├── contactSchema.js
│   ├── newsletterShema.js
│   └── refreshTokenSchema.js
├── routes/
│   ├── authRoutes.js
│   ├── AddTripRoutes.js
│   ├── BookingRoutes.js
│   ├── flightRoutes.js
│   ├── HotelRoutes.js
│   ├── paymentRoutes.js
│   ├── blogRoutes.js
│   ├── offeringsRoutes.js
│   ├── hiddenGemRoutes.js
│   ├── newsletterRoute.js
│   ├── contactRoutes.js
│   ├── searchRoutes.js
│   ├── adminRoute.js
│   ├── userdashboardRoutes.js
│   ├── guideDashboardRoute.js
│   └── passportRoutes.js
├── services/
│   ├── generateToken.js
│   ├── verifyToken.js
│   ├── logger.js
│   ├── miling.js
│   ├── flightServices.js
│   ├── HotelServices.js
│   └── providers/
├── .env
├── .gitignore
├── package.json
├── server.js
└── README.md
```

## Important Files and Folders

| Path | Purpose |
|---|---|
| `server.js` | Main app entry point. Sets up middleware, routes, Swagger, DB connection, and server startup. |
| `config/db.js` | Connects the app to MongoDB using Mongoose. |
| `routes/` | Defines API endpoints and connects them to controllers. |
| `controller/` | Contains the business logic for auth, bookings, content, and dashboards. |
| `model/` | Mongoose schemas for users, trips, bookings, blogs, newsletters, and more. |
| `middleware/` | Reusable request middleware like auth, role checks, logging, error handling, upload validation, and rate limiting. |
| `services/` | Shared utilities such as token generation, logging, email sending, and external API providers. |
| `docs/swagger.js` | Swagger/OpenAPI configuration for API documentation. |
| `config/cloudinary.js` | Handles image upload configuration. |

## Installation Guide

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd Kemet/Back-end
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create an environment file

Create a `.env` file in the `Back-end` folder.

### 4. Add your environment variables

Use the example below as a starting point.

### 5. Start MongoDB

Make sure your MongoDB instance is running locally or use a MongoDB Atlas connection string.

### 6. Run the project

```bash
npm run dev
```

## Environment Variables Setup

Create a file named `.env` inside `Back-end/`.

### `.env.example`

```env
PORT=8000
NODE_ENV=development

MONGO_URI=mongodb://127.0.0.1:27017/kemet

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_SECRET_OLD=your_optional_old_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
RESET_PASSWORD_SECRET=your_reset_password_secret

DOMAIN=http://localhost:3000
BACKEND_URL=http://localhost:8000

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:8000/api/auth/google/callback

EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password_or_app_password

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

### Environment Variable Notes

| Variable | Description |
|---|---|
| `PORT` | Port where the backend runs. |
| `NODE_ENV` | Set to `development` or `production`. |
| `MONGO_URI` | MongoDB connection string. |
| `ACCESS_TOKEN_SECRET` | Secret used to sign access tokens. |
| `REFRESH_TOKEN_SECRET` | Secret used to sign refresh tokens. |
| `RESET_PASSWORD_SECRET` | Secret used in password reset flow. |
| `DOMAIN` | Frontend base URL used in auth and email flows. |
| `BACKEND_URL` | Backend base URL used by Stripe redirect logic. |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID. |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret. |
| `GOOGLE_CALLBACK_URL` | Google OAuth callback endpoint. |
| `EMAIL_USER` | Email address used to send messages. |
| `EMAIL_PASS` | Email account password or app password. |
| `STRIPE_SECRET_KEY` | Stripe secret key for payments. |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook verification secret. |
| `CLOUDINARY_*` | Cloudinary credentials for image uploads. |
| `AMADEUS_*` | Credentials for flight/hotel provider integration. |
| `HOTEL_MAKCORPS_KEY` | Hotel API provider key. |
| `FLIGHT_API_KEY` | Flight API provider key if used by the provider config. |

## Running the Project

### Development mode

Starts the server with Nodemon so it automatically restarts when files change.

```bash
npm run dev
```

### Production mode

Starts the server with Node.js.

```bash
npm start
```

### Default local URLs

- API root: `http://localhost:8000/`
- Swagger docs: `http://localhost:8000/api-docs`
- Swagger JSON: `http://localhost:8000/api-docs.json`

## Available Scripts

| Script | Description |
|---|---|
| `npm start` | Run the production server with Node.js |
| `npm run dev` | Run the development server with Nodemon |
| `npm run lint` | Check code style using ESLint |
| `npm run lint:fix` | Automatically fix lint issues where possible |
| `npm test` | Placeholder test script currently not implemented |

## API Overview

The API uses the `/api` prefix for most endpoints.

### Main Route Groups

| Base Route | Description |
|---|---|
| `/api/auth` | Authentication, email verification, password reset, refresh token |
| `/api/Trip` | Trip management |
| `/api/flight` | Flight search, pricing, and details |
| `/api/hotels` | Hotel search and hotel offer details |
| `/api/booking` | Booking creation and cancellation |
| `/api/payments` | Stripe checkout, success, refund, webhook |
| `/api/blog` | Blogs and blog comments |
| `/api/contact` | Contact form endpoints |
| `/api/newsletter` | Newsletter subscribe, send, unsubscribe |
| `/api/offerings` | Offerings CRUD |
| `/api/hiddenGem` | Hidden gems CRUD |
| `/api/searchHandler` | Trip filtering/search |
| `/api/adminDashboard` | Admin dashboard routes |
| `/api/userdashboard` | User dashboard routes |
| `/api/guideDashboard` | Guide dashboard routes |
| `/api/passport` | Passport image validation endpoints |

### API Endpoint Table

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Login user and set cookies | No |
| `GET` | `/api/auth/verify-email` | Verify email using token | No |
| `POST` | `/api/auth/refresh` | Refresh access token using refresh cookie | No |
| `POST` | `/api/auth/reset-password` | Request password reset | No |
| `POST` | `/api/auth/reset-password-confirm` | Confirm password reset | No |
| `GET` | `/api/auth/continueWithGoogle` | Start Google OAuth login | No |
| `POST` | `/api/Trip/addTrip` | Create a trip | Admin |
| `GET` | `/api/Trip/` | Get all trips | No |
| `GET` | `/api/Trip/:id` | Get trip by ID | No |
| `PUT` | `/api/Trip/updateTrip/:id` | Update a trip | Admin |
| `DELETE` | `/api/Trip/deleteTrip/:id` | Delete a trip | Admin |
| `GET` | `/api/searchHandler/search` | Search trips by filters | No |
| `POST` | `/api/flight/search` | Search flights | No |
| `POST` | `/api/flight/details` | Get flight details | No |
| `POST` | `/api/flight/price` | Price a flight offer | No |
| `POST` | `/api/hotels/search` | Search hotels | No |
| `GET` | `/api/hotels/getOneHotelDetails` | Get hotel offers/details | No |
| `POST` | `/api/booking/create` | Create a booking with passport images | User |
| `DELETE` | `/api/booking/:bookingId` | Cancel booking | User/Admin |
| `POST` | `/api/payments/stripe-checkout` | Start Stripe checkout | User |
| `POST` | `/api/payments/webhook` | Stripe webhook handler | Stripe |
| `GET` | `/api/payments/success` | Payment success redirect handler | No |
| `GET` | `/api/payments/refund` | Refund flow endpoint | No |
| `POST` | `/api/blog/` | Create blog | User |
| `GET` | `/api/blog/` | Get all blogs | No |
| `POST` | `/api/blog/addComment/:blogId` | Add blog comment | User |
| `POST` | `/api/newsletter/subscribe` | Subscribe to newsletter | No |
| `POST` | `/api/newsletter/send` | Send newsletter to subscribers | Admin |
| `POST` | `/api/passport/validate` | Validate passport image upload | No |

## Example API Requests and Responses

### 1. Register a User

**Request**

```http
POST /api/auth/register
Content-Type: application/json
```

```json
{
  "name": "Amr Assal",
  "email": "amr@example.com",
  "password": "StrongPass1",
  "Nationality": "Egyptian"
}
```

**Example Response**

```json
{
  "user": {
    "name": "Amr Assal",
    "email": "amr@example.com",
    "role": "user"
  },
  "message": "User registered successfully"
}
```

### 2. Login

**Request**

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "email": "amr@example.com",
  "password": "StrongPass1"
}
```

**Example Response**

```json
{
  "user": {
    "name": "Amr Assal",
    "email": "amr@example.com",
    "role": "user"
  },
  "message": "Login successful, welcome back Amr Assal"
}
```

### 3. Search Trips

**Request**

```http
GET /api/searchHandler/search?location=Cairo&duration=3&travelers=2
```

**Example Response**

```json
[
  {
    "_id": "6650abcd1234ef5678901234",
    "name": "Cairo City Escape",
    "location": "Cairo",
    "duration": 3,
    "price": 1500
  }
]
```

### 4. Create Booking

This endpoint expects:

- An authenticated user
- `multipart/form-data`
- One or more passport images in the `passportImage` field

**Request fields example**

```bash
bookingId=<generated_or_related_value>
passportImage=<image file>
```

### 5. Validate Passport Image

**Request**

```http
POST /api/passport/validate
Content-Type: multipart/form-data
```

**Form field**

```text
passport: <image file>
```

**Example Response**

```json
{
  "message": "Passport validation completed"
}
```

Note: the exact response body depends on the passport validation controller logic.

## Authentication System

The project uses a cookie-based JWT authentication system.

### How it works

1. A user registers or logs in.
2. The backend creates:
   - an access token
   - a refresh token
3. Both tokens are stored in **HTTP-only cookies**:
   - `x-auth-token`
   - `x-refresh-token`
4. Protected routes use the `authenticate` middleware to verify the access token.
5. Role checks use the `authorize` middleware.
6. When the access token expires, the client can call `/api/auth/refresh`.

### Supported auth features

- Email/password registration
- Email verification
- Login/logout
- Refresh token flow
- Password reset
- Google OAuth login using Passport.js
- Role-based access control

## Database Information

This project uses **MongoDB** with **Mongoose**.

### Main collections/models

| Model | Purpose |
|---|---|
| `userSchema.js` | Stores users, roles, verification data, and profile details |
| `refreshTokenSchema.js` | Stores refresh tokens for session refresh logic |
| `tripSchema.js` | Stores trip data |
| `BookingSchema.js` | Stores booking and payment details |
| `blogSchema.js` | Stores blogs and comments |
| `offeringSchema.js` | Stores offerings/promotions |
| `hiddenGemSchema.js` | Stores hidden gem content |
| `guideSchema.js` | Stores guide-related data |
| `guestSchema.js` | Stores guest or traveler details |
| `contactSchema.js` | Stores contact requests |
| `newsletterShema.js` | Stores newsletter subscribers |

### Database connection

The MongoDB connection is created in:

```bash
config/db.js
```

The app starts only after attempting to connect to the database.

## Middleware Used

| Middleware | Purpose |
|---|---|
| `express.json()` | Parses JSON request bodies |
| `express.urlencoded()` | Parses form body data |
| `cookie-parser` | Reads cookies from incoming requests |
| `cors` | Allows frontend apps to communicate with the backend |
| `helmet` | Adds secure HTTP headers |
| `express-session` | Session support for auth-related flows |
| `authenticate` | Verifies JWT from `x-auth-token` cookie |
| `authorize` | Restricts routes by role |
| `rateLimiter` | Limits repeated requests to auth and API routes |
| `morganMW` | Logs incoming requests |
| `multer` | Handles multipart file uploads |
| `passportImageValidation` | Validates uploaded passport images with Sharp |
| `ErrorMW` | Handles application errors in one place |

## Error Handling

The project uses centralized error handling through:

```bash
middleware/ErrorMW.js
```

It also handles:

- Validation failures
- Unauthorized access
- Forbidden access
- Upload errors
- MongoDB connection issues
- Uncaught exceptions
- Unhandled promise rejections

Typical error response example:

```json
{
  "message": "Unauthorized"
}
```

## Security Features

- JWT stored in HTTP-only cookies
- Role-based authorization
- Helmet for secure headers
- Rate limiting on auth and API endpoints
- Password hashing with `bcryptjs`
- Google OAuth support
- Email verification flow
- Refresh token storage in database
- Input and image validation

## File Uploads / Storage

Yes, file uploads are supported. 📁

### Current upload flow

- Uploads are handled using **Multer**
- Files are stored in memory first
- Images are validated before processing
- Cloudinary is used for cloud image storage
- Sharp is used to inspect image metadata

### Supported image formats

- `.jpg`
- `.jpeg`
- `.png`
- `.webp`

### Upload use cases in this project

- Trip images
- Blog images
- Hidden gem images
- Offering images
- Passport images for booking or validation flows

## Realtime Features

There are currently **no realtime features** such as WebSockets or Socket.IO in this backend.

If realtime chat, live booking updates, or notifications are needed later, they can be added in a future version.

## Deployment Instructions

This backend is prepared for production environments through environment variables and `NODE_ENV`.

### Basic deployment steps

1. Create a production MongoDB database
2. Add all required environment variables on your hosting platform
3. Set `NODE_ENV=production`
4. Set `DOMAIN` to your frontend production URL
5. Set `BACKEND_URL` to your backend production URL
6. Configure Stripe webhook URL
7. Start the server with:

```bash
npm start
```

### Swagger in production

Swagger server URLs are automatically adjusted based on:

- `NODE_ENV`
- `VERCEL_URL`

### Deployment checklist

- MongoDB is reachable
- All secrets are configured
- Google OAuth callback URL is updated
- Stripe webhook secret is correct
- Cloudinary credentials are valid
- CORS origin matches the frontend URL

## Troubleshooting

### `MongoDB connection failed`

Check:

- `MONGO_URI` is correct
- Your MongoDB server is running
- Your network/IP is allowed if using MongoDB Atlas

### `Unauthorized` on protected routes

Check:

- You are logged in
- Cookies are being sent by the frontend
- The access token cookie has not expired

### Google login is not working

Check:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_CALLBACK_URL`
- Google Console redirect URI settings

### Stripe webhook verification fails

Check:

- `STRIPE_WEBHOOK_SECRET` matches the Stripe webhook endpoint
- The webhook route receives the raw body exactly as configured

### Images are rejected

Check:

- File type is supported
- File size is under 10MB for passport validation flow
- Image resolution is at least `200x200`

### CORS errors from frontend

Check:

- Frontend URL matches the backend CORS configuration
- Requests send credentials when cookies are required

## Future Improvements

- Add automated tests for routes and services
- Add request validation with a dedicated library like Joi or Zod
- Improve API response consistency
- Add pagination and filtering to more resources
- Improve production-ready session and cookie configuration
- Add Docker support
- Add CI/CD pipeline
- Add realtime notifications if needed
- Expand Swagger coverage for every endpoint

## Contributors

- Amr Assal — Backend Developer
- Mahmoud Hazem Shatout — Backend Developer

## License

This project is licensed under the **ISC** License.

