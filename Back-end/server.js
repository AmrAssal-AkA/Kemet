// server.js
const dotenv = require("dotenv");
dotenv.config();
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

// Connect to database
connectDB();
// Middleware
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
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
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
app.use("/api/payments", paymentRoutes);
app.use("/api/guideDashboard", guideDashboardRoute);



app.get("/", (req, res) => {
  Logger.info("Root endpoint accessed");
  res.send("Welcome to the Travel Agency API");
});

app.listen(port, () => {
  Logger.info(`Server is running on port ${port}`);
});
