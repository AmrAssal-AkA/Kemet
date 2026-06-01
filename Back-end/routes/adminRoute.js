const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

const adminDashboardController = require("../controller/Dashboards/adminDashboardController");
const User = require("../model/userSchema");
const Booking = require("../model/BookingSchema");
const blog = require("../model/blogSchema");
const trip = require("../model/tripSchema");

// Admin Dashboard Routes
router.get(
  "/AllUsers",
  authenticate,
  authorize("admin"),
  adminDashboardController.getAllUsers,
);

router.patch(
  "/upgradeUser/:userId",
  authenticate,
  authorize("admin"),
  adminDashboardController.upgradeUser,
);

router.get(
  "/bookingDetails",
  authenticate,
  authorize("admin"),
  adminDashboardController.getBookingsDetails,
);

router.get(
  "/bookings/:bookingId/available-guides",
  authenticate,
  authorize("admin"),
  adminDashboardController.getAvailableGuidesForBooking,
);

router.patch(
  "/bookings/:bookingId/assign-guide",
  authenticate,
  authorize("admin"),
  adminDashboardController.assignGuideToBooking,
);

router.get(
  "/stats/trips",
  authenticate,
  authorize("admin"),
  async (req, res) => {
    const [totalUsers, totalBookings, totalTrips, totalBlogs] =
      await Promise.all([
        User.countDocuments({ role: { $in: ["user", "guide"] } }),
        Booking.countDocuments(),
        trip.countDocuments(),
        blog.countDocuments(),
      ]);
    res.status(200).json({
      totalUsers,
      totalBookings,
      totalBlogs,
      totalTrips,
    });
  },
);

router.get(
  "/stats/blogs",
  authenticate,
  authorize("admin"),
  async (req, res) => {
    const [totalBlogs, publishedBlogs, BlogDuration] = await Promise.all([
      blog.countDocuments(),
      blog.countDocuments({ isPublished: true }),
      blog.countDocuments({
        isPublished: true,
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      }),
    ]);
    res.status(200).json({
      totalBlogs,
      publishedBlogs,
      BlogDuration,
    });
  },
);

router.get(
  "/stats/revenue",
  authenticate,
  authorize("admin"),
  async (req, res) => {
    const normalizeText = (value) => String(value || "").trim().toLowerCase();
    const toMoneyNumber = (value) => {
      const number = Number(value);
      return Number.isFinite(number) ? number : 0;
    };
    const firstMoneyNumber = (values) => {
      for (const value of values) {
        const number = toMoneyNumber(value);
        if (number > 0) return number;
      }
      return 0;
    };
    const getItemExpense = (booking, expenseType) => {
      if (!Array.isArray(booking.items)) return 0;

      return booking.items.reduce((total, item) => {
        const label = normalizeText(
          item.type || item.category || item.name || item.title || item.bookingType,
        );
        if (!label.includes(expenseType)) return total;

        return (
          total +
          firstMoneyNumber([
            item.cost,
            item.price,
            item.totalPrice,
            item.amount,
            item.price?.total,
          ])
        );
      }, 0);
    };
    const getHotelExpense = (booking) =>
      firstMoneyNumber([
        booking.hotelCost,
        booking.hotelPrice,
        booking.selectedHotel?.cost,
        booking.selectedHotel?.price,
        booking.selectedHotel?.price?.total,
        booking.selectedHotel?.offers?.[0]?.price?.total,
        booking.hotel?.cost,
        booking.hotel?.price,
        booking.hotel?.price?.total,
        booking.hotel?.data?.cost,
        booking.hotel?.data?.price,
        booking.hotel?.data?.price?.total,
        getItemExpense(booking, "hotel"),
      ]);
    const getFlightExpense = (booking) =>
      firstMoneyNumber([
        booking.flightCost,
        booking.flightPrice,
        booking.selectedFlight?.cost,
        booking.selectedFlight?.price,
        booking.selectedFlight?.price?.total,
        booking.flight?.cost,
        booking.flight?.price,
        booking.flight?.price?.total,
        booking.flight?.data?.cost,
        booking.flight?.data?.price,
        booking.flight?.data?.price?.total,
        getItemExpense(booking, "flight"),
      ]);
    const getRefundAmount = (booking) => {
      const refundsTotal = Array.isArray(booking.refunds)
        ? booking.refunds.reduce(
            (total, refund) => total + toMoneyNumber(refund.amount),
            0,
          )
        : 0;

      return firstMoneyNumber([
        booking.refundAmount,
        booking.refundedAmount,
        refundsTotal,
        booking.totalPrice,
      ]);
    };
    const isConfirmedPaidBooking = (booking) => {
      const status = normalizeText(booking.status);
      const paymentStatus = normalizeText(booking.paymentStatus);

      return status === "confirmed" && paymentStatus === "paid";
    };
    const isRefundedOrCancelledBooking = (booking) => {
      const status = normalizeText(booking.status);
      const paymentStatus = normalizeText(booking.paymentStatus);

      return (
        status === "cancelled" ||
        status === "canceled" ||
        paymentStatus === "refunded"
      );
    };

    const bookings = await Booking.find().lean();
    const validBookings = bookings.filter(isConfirmedPaidBooking);
    const refundedBookings = bookings.filter(isRefundedOrCancelledBooking);
    const totalRevenue = validBookings.reduce(
      (total, booking) => total + toMoneyNumber(booking.totalPrice),
      0,
    );
    const hotelExpenses = validBookings.reduce(
      (total, booking) => total + getHotelExpense(booking),
      0,
    );
    const flightExpenses = validBookings.reduce(
      (total, booking) => total + getFlightExpense(booking),
      0,
    );
    const refundsTotal = refundedBookings.reduce(
      (total, booking) => total + getRefundAmount(booking),
      0,
    );
    // totalRevenue already excludes refunded/cancelled bookings; refundsTotal is
    // shown separately for finance visibility and is not subtracted from it twice.
    const kemetRevenue =
      totalRevenue - hotelExpenses - flightExpenses - refundsTotal;

    res.status(200).json({
      totalRevenue,
      kemetRevenue,
      hotelExpenses,
      flightExpenses,
      refundsTotal,
      validBookingCount: validBookings.length,
      refundedBookingCount: refundedBookings.length,
    });
  },
);

router.patch(
  "/confirmBooking/:bookingId",
  authenticate,
  authorize("admin"),
  adminDashboardController.confirmBooking,
);

module.exports = router;
