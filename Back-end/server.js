// server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const app = express();
dotenv.config();

// Importing routes
const connectDB = require("./services/db");
const addTripRoute = require("./routes/AddTripRoutes");
const FlightRoute = require("./routes/flightRoutes");
const HotelRoute = require("./routes/HotelRoutes");
const contactRoute = require("./routes/contactRoutes");
const blogRoute = require("./routes/blogRoutes");
const BookingRoute = require("./routes/BookingRoutes");
const authRoute = require("./routes/authRoutes");
const adminRoute = require("./routes/adminRoute");
const passport = require("passport");
const port = process.env.PORT;

// Connect to database
connectDB();
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({origin: "http://localhost:3000", credentials: true }));
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

// Routes
app.use("/api/Trip", addTripRoute);
app.use("/api/flight", FlightRoute);
app.use("/api/hotels", HotelRoute);
app.use("/api/contact", contactRoute);
app.use("/api/blog", blogRoute);
app.use("/api/booking", BookingRoute);
app.use("/api/auth", authRoute);
app.use("/api/adminDashboard", adminRoute);

app.get("/", (req, res) => {
  res.send("Welcome to Kemet Travel Agency API");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
