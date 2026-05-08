const EgyptianPassportRegex = "^[A-Z]{2}[0-9]{7}$";
const AmaricanPassportRegex = "^[0-9]{9}$";
const SuadiPassportRegex = "^[A-Z]{1}[0-9]{7}$";
const EuropeanPassportRegex = "^[A-Z]{1}[0-9]{8}$";

const passportRegex = new RegExp(
  `(${EgyptianPassportRegex})|(${AmaricanPassportRegex})|(${SuadiPassportRegex})|(${EuropeanPassportRegex})`
);

const validateBooking = (req, res, next) => {
  const { guests, flight, hotel, trip, totalPrice } = req.body;

  if (!flight && !hotel && !trip) {
    return res.status(400).json({
      success: false,
      message: "Booking must include all trip, flight, and hotel details",
    });
  }

  if (!totalPrice || totalPrice <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid total price",
    });
  }

  if (!guests || !Array.isArray(guests) || guests.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Guests are required",
    });
  }

  const passportSet = new Set();
  let adults = 0;
  let infants = 0;

  for (const g of guests) {
    g.firstName = g.firstName?.trim().toUpperCase();
    g.lastName = g.lastName?.trim().toUpperCase();
    g.passportNumber = g.passportNumber?.trim().toUpperCase();

    if (!g.firstName || !g.lastName || !g.passportNumber) {
      return res.status(400).json({
        success: false,
        message: "Missing guest fields",
      });
    }

    if (!passportRegex.test(g.passportNumber)) {
      return res.status(400).json({
        success: false,
        message: "Invalid passport format",
      });
    }

    if (passportSet.has(g.passportNumber)) {
      return res.status(400).json({
        success: false,
        message: "Duplicate passport in same booking",
      });
    }
    passportSet.add(g.passportNumber);

    if (new Date(g.expiryDate) <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Expired passport detected",
      });
    }
    const minDate = new Date();
    minDate.setMonth(minDate.getMonth() + 6);

    if (new Date(g.expiryDate) < minDate) {
      return res.status(400).json({
        success: false,
        message: "Passport must be valid for 6 months",
      });
    }

    if (g.type === "adult") adults++;
    if (g.type === "infant") infants++;
  }

  if (infants > adults) {
    return res.status(400).json({
      success: false,
      message: "Each infant must have an adult",
    });
  }

  if (req.user) {
    req.body.userId = req.user.userId;
  }

  next();
};

module.exports = validateBooking;