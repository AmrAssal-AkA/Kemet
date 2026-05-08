// server.js
const dotenv = require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const swaggerUi = require("swagger-ui-express");
const app = express();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Importing routes
const connectDB = require("./config/db");
const addTripRoute = require("./routes/AddTripRoutes");
const FlightRoute = require("./routes/flightRoutes");
const HotelRoute = require("./routes/HotelRoutes");
const contactRoute = require("./routes/contactRoutes");
const blogRoute = require("./routes/blogRoutes");
const BookingRoute = require("./routes/BookingRoutes");
const authRoute = require("./routes/authRoutes");
const adminRoute = require("./routes/adminRoute");
const { authLimiter, apiLimiter } = require("./middleware/rateLimiter");
const Logger = require("./services/logger");
const morganMiddleware = require("./middleware/morganMW");
const swaggerSpec = require("./docs/swagger");
const passport = require("passport");
const port = process.env.PORT;
const userRoutes = require("./routes/userdashboardRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const guideDashboardRoute = require("./routes/guideDashboardRoute");
const errorHandlerMW = require("./middleware/ErrorMW");

// Connect to database
connectDB();
// Middleware
app.use("/api/payments", paymentRoutes);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(morganMiddleware);
app.use(
  session({
    secret: "SessionSecretKey",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 },
  }),
);
app.use(helmet());
require("./controller/auth/authController");
app.use(passport.initialize());

const swaggerUiOptions = {
  swaggerOptions: {
    url: "/api-docs.json",
    persistAuthorization: true,
    deepLinking: true,
  },
  customCss: ".swagger-ui { background-color: #fafafa; }",
  customCssUrl: "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.min.css",
  customJs: [
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-bundle.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-standalone-preset.min.js",
  ],
  customSiteTitle: "Kemet Travel API Docs",
};

app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerSpec, swaggerUiOptions));

app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "public, max-age=0");
  res.send(swaggerSpec);
});

process.on("uncaughtException", (exception) => {
  Logger.error(`Uncaught Exception: ${exception.message}`);
  process.exit(1);
});
process.on("unhandledRejection", (reason, promise) => {
  Logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
  process.exit(1);
});

// Routes
app.use("/api", apiLimiter);
app.use("/api/Trip", addTripRoute);
app.use("/api/flight", FlightRoute);
app.use("/api/hotels", HotelRoute);
app.use("/api/contact", contactRoute);
app.use("/api/blog", blogRoute);
app.use("/api/booking", BookingRoute);
app.use("/api/auth", authLimiter, authRoute);
app.use("/api/adminDashboard", adminRoute);
app.use("/api/userdashboard", userRoutes);
app.use("/api/guideDashboard", guideDashboardRoute);

app.get("/", (req, res) => {
  Logger.info("Root endpoint accessed");
  res.send("Welcome to the Travel Agency API");
});

app.use(errorHandlerMW);

if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    Logger.info(`Server is running on port ${port}`);
  });
}

module.exports = app;
