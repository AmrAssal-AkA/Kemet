const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");
const app = express();
dotenv.config();


const connectDB = require("./services/db");
const addTripRoute = require("./routes/AddTripRoutes");
const FlightRoute = require("./routes/flightRoutes");
const HotelRoute = require("./routes/HotelRoutes");
const contactRoute = require("./routes/contactRoutes");
const blogRoute = require("./routes/blogRoutes");
const BookingRoute = require("./routes/BookingRoutes");
const port = process.env.PORT;


connectDB();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cors());
app.use(helmet());
app.use("/addtrip", addTripRoute);
app.use("/flight", FlightRoute);
app.use("/hotels", HotelRoute);
app.use("/contact", contactRoute);
app.use("/blog", blogRoute);
app.use("/booking", BookingRoute);

app.get("/", (req,res) => {
    res.send("Welcome to Kemet Travel Agency API");
});




app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})