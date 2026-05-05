const swaggerJSDoc = require("swagger-jsdoc");

const port = process.env.PORT || 8000;

const definition = {
  openapi: "3.0.3",
  info: {
    title: "Kemet Travel API",
    version: "1.0.0",
    description:
      "Interactive API documentation for the Kemet backend services.",
  },
  servers: [
    {
      url: `http://localhost:${port}`,
      description: "Local development server",
    },
  ],
  tags: [
    { name: "Auth", description: "Authentication and session endpoints" },
    { name: "Trips", description: "Trip management endpoints" },
    { name: "Flights", description: "Flight search and pricing endpoints" },
    { name: "Hotels", description: "Hotel search and offer endpoints" },
    { name: "Contact", description: "Contact form endpoints" },
    { name: "Blogs", description: "Blog management endpoints" },
    { name: "Hidden Gems", description: "Hidden gem management endpoints" },
    { name: "Offerings", description: "Offering management endpoints" },
    { name: "Bookings", description: "Unified booking endpoints" },
    { name: "Payments", description: "Payment processing endpoints" },
    { name: "Admin", description: "Admin dashboard endpoints" },
    {
      name: "User Dashboard",
      description: "Saved and booked trip endpoints for users",
    },
    {
      name: "Guide Dashboard",
      description: "Endpoints for tour guides",
    },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "x-auth-token",
        description: "Authentication cookie set after login/register.",
      },
      refreshCookie: {
        type: "apiKey",
        in: "cookie",
        name: "x-refresh-token",
        description: "Refresh token cookie used by the auth refresh endpoint.",
      },
      userIdCookie: {
        type: "apiKey",
        in: "cookie",
        name: "userId",
        description:
          "Legacy cookie used directly by user dashboard routes instead of the auth middleware.",
      },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          userId: { type: "string" },
          name: { type: "string" },
          email: { type: "string", format: "email" },
          role: {
            type: "string",
            enum: ["user", "admin", "guide"],
          },
          isVerified: { type: "boolean" },
        },
      },
      AuthRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string", format: "password" },
        },
      },
      RegisterRequest: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string" },
          email: { type: "string", format: "email" },
          password: { type: "string", format: "password" },
        },
      },
      ResetPasswordRequest: {
        type: "object",
        required: ["token", "newPassword"],
        properties: {
          token: { type: "string" },
          newPassword: { type: "string", format: "password" },
        },
      },
      EmailRequest: {
        type: "object",
        required: ["email"],
        properties: {
          email: { type: "string", format: "email" },
        },
      },
      Trip: {
        type: "object",
        properties: {
          _id: { type: "string" },
          tripId: { type: "string" },
          name: { type: "string" },
          city: { type: "string" },
          category: { type: "string" },
          description: { type: "string" },
          price: { type: "number" },
          duration: { type: "number" },
          location: { type: "string" },
          imageUrl: { type: "string" },
          cloudinaryId: { type: "string" },
        },
      },
      CreateTripRequest: {
        type: "object",
        required: [
          "name",
          "city",
          "category",
          "description",
          "price",
          "duration",
          "location",
          "image",
        ],
        properties: {
          name: { type: "string" },
          city: { type: "string" },
          category: { type: "string" },
          description: { type: "string" },
          price: { type: "number" },
          duration: { type: "number" },
          location: { type: "string" },
          image: { type: "string", format: "binary" },
          guideAvailable: { type: "boolean", default: false },
          guidefees: { type: "number", default: 0 },
          guestCapacity: { type: "number", default: 0 },
        },
      },
      ContactRequest: {
        type: "object",
        required: ["name", "email", "subject", "message"],
        properties: {
          name: { type: "string" },
          email: { type: "string", format: "email" },
          subject: { type: "string" },
          message: { type: "string" },
        },
      },
      Blog: {
        type: "object",
        properties: {
          _id: { type: "string" },
          title: { type: "string" },
          content: { type: "string" },
          images: {
            type: "array",
            items: {
              type: "object",
              properties: {
                imageUrl: { type: "string" },
                cloudinaryId: { type: "string" },
              },
            },
          },
          author: {
            oneOf: [{ type: "string" }, { $ref: "#/components/schemas/User" }],
          },
        },
      },
      CreateBlogRequest: {
        type: "object",
        required: ["title", "content", "images"],
        properties: {
          title: { type: "string" },
          content: { type: "string" },
          images: {
            type: "array",
            items: { type: "string", format: "binary" },
          },
        },
      },
      HiddenGem: {
        type: "object",
        properties: {
          _id: { type: "string" },
          location: { type: "string" },
          reviews: { type: "string" },
          images: {
            type: "array",
            items: {
              type: "object",
              properties: {
                imageUrl: { type: "string" },
                cloudinaryId: { type: "string" },
              },
            },
          },
        },
      },
      Offering: {
        type: "object",
        properties: {
          _id: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
          reviews: { type: "string" },
          price: { type: "number" },
          images: {
            type: "array",
            items: {
              type: "object",
              properties: {
                imageUrl: { type: "string" },
                cloudinaryId: { type: "string" },
              },
            },
          },
        },
      },
      FlightSearchRequest: {
        type: "object",
        required: ["origin", "destination", "departureDate", "adults"],
        properties: {
          origin: {
            type: "string",
            minLength: 3,
            maxLength: 3,
            example: "CAI",
            description: "3-letter IATA origin airport or city code.",
          },
          destination: {
            type: "string",
            minLength: 3,
            maxLength: 3,
            enum: [
              "CAI",
              "ALY",
              "HRG",
              "LXR",
              "ASW",
              "HBE",
              "PSD",
              "SKV",
              "TCP",
              "ELT",
              "MUH",
              "SPX",
            ],
            example: "LXR",
            description:
              "Destination must be one of the supported Egyptian airport codes.",
          },
          departureDate: { type: "string", format: "date" },
          returnDate: { type: "string", format: "date" },
          adults: { type: "integer", minimum: 1, maximum: 9 },
          children: { type: "integer", minimum: 0 },
          infants: { type: "integer", minimum: 0 },
          currencyCode: { type: "string", example: "EGP" },
          max: {
            type: "integer",
            minimum: 1,
            maximum: 50,
            example: 20,
          },
          travelClass: {
            type: "string",
            enum: ["ECONOMY", "PREMIUM_ECONOMY", "BUSINESS", "FIRST"],
          },
        },
      },
      FlightPriceRequest: {
        type: "object",
        required: [
          "flightOffer",
          "origin",
          "destination",
          "departureDate",
          "adults",
        ],
        properties: {
          flightOffer: {
            type: "object",
            additionalProperties: true,
          },
          flightOffers: {
            type: "object",
            additionalProperties: true,
          },
          origin: {
            type: "string",
            minLength: 3,
            maxLength: 3,
            example: "CAI",
            description:
              "Currently required by the route middleware even though pricing uses the flight offer payload.",
          },
          destination: {
            type: "string",
            minLength: 3,
            maxLength: 3,
            enum: [
              "CAI",
              "ALY",
              "HRG",
              "LXR",
              "ASW",
              "HBE",
              "PSD",
              "SKV",
              "TCP",
              "ELT",
              "MUH",
              "SPX",
            ],
            example: "LXR",
            description:
              "Currently required by the route middleware even though pricing uses the flight offer payload.",
          },
          departureDate: {
            type: "string",
            format: "date",
            description:
              "Currently required by the route middleware even though pricing uses the flight offer payload.",
          },
          adults: {
            type: "integer",
            minimum: 1,
            maximum: 9,
            description:
              "Currently required by the route middleware even though pricing uses the flight offer payload.",
          },
        },
      },
      HotelSearchRequest: {
        type: "object",
        required: [
          "cityCode",
          "checkInDate",
          "checkOutDate",
          "NumberOfGuests",
          "NumberOfrooms",
        ],
        properties: {
          cityCode: {
            type: "string",
            enum: [
              "CAI",
              "ALY",
              "HRG",
              "LXR",
              "ASW",
              "PSD",
              "SKV",
              "TCP",
              "ELT",
              "MUH",
              "SSH",
              "RMF",
              "DBB",
            ],
            example: "CAI",
            description: "Supported Egyptian city code.",
          },
          checkInDate: { type: "string", format: "date" },
          checkOutDate: { type: "string", format: "date" },
          NumberOfGuests: { type: "integer", minimum: 1 },
          NumberOfrooms: { type: "integer", minimum: 1 },
        },
      },
      HotelOfferRequest: {
        type: "object",
        required: ["hotelId", "checkInDate", "checkOutDate", "adults"],
        properties: {
          hotelId: { type: "string" },
          checkInDate: { type: "string", format: "date" },
          checkOutDate: { type: "string", format: "date" },
          adults: { type: "integer", minimum: 1 },
        },
      },
      RoleUpdateRequest: {
        type: "object",
        required: ["role"],
        properties: {
          role: {
            type: "string",
            enum: ["user", "admin", "guide"],
          },
        },
      },
      PaymentRequest: {
        type: "object",
        required: ["bookingId", "amount", "currency"],
        properties: {
          bookingId: {
            type: "string",
            description: "MongoDB ObjectId of the booking",
          },
          amount: {
            type: "number",
            description: "Payment amount in the specified currency",
          },
          currency: {
            type: "string",
            example: "EGP",
            description: "Currency code",
          },
          metadata: {
            type: "object",
            additionalProperties: true,
            description: "Additional metadata for the payment",
          },
        },
      },
      Payment: {
        type: "object",
        properties: {
          _id: { type: "string" },
          userId: { type: "string" },
          bookingId: { type: "string" },
          stripePaymentId: { type: "string" },
          stripeCustomerId: { type: "string" },
          amount: { type: "number" },
          currency: { type: "string" },
          status: {
            type: "string",
            enum: ["pending", "succeeded", "failed", "refunded", "canceled"],
          },
          paymentMethod: { type: "string" },
          receiptUrl: { type: "string" },
          refundId: { type: "string" },
          metadata: { type: "object" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      RefundRequest: {
        type: "object",
        required: ["amount"],
        properties: {
          amount: { type: "number", description: "Amount to refund" },
        },
      },
      Booking: {
        type: "object",
        properties: {
          _id: { type: "string" },
          userId: { type: "string", description: "Reference to User" },
          guests: {
            type: "array",
            items: { $ref: "#/components/schemas/Guest" },
            description: "Array of guests with passport information",
          },
          flight: {
            type: "object",
            properties: {
              orderId: { type: "string" },
              data: { type: "object" },
            },
          },
          hotel: {
            type: "object",
            properties: {
              orderId: { type: "string" },
              data: { type: "object" },
            },
          },
          trip: {
            type: "array",
            items: { type: "string", description: "Reference to Trip" },
          },
          PassportNumber: {
            type: "string",
            description:
              "Primary passport number persisted on the booking document.",
          },
          totalPrice: { type: "number" },
          currency: {
            type: "string",
            default: "EGP",
            description:
              "Currency code stored with the booking. During booking creation it is typically derived from the first guest nationality (`USA` -> `USD`, `EG` -> `EGP`, `EUR` -> `EUR`) and otherwise falls back to the provided request value.",
          },
          status: {
            type: "string",
            enum: ["Pending", "Confirmed", "Cancelled"],
            default: "Pending",
          },
          paymentStatus: {
            type: "string",
            enum: ["Pending", "Paid", "Failed", "Refunded", "PartiallyRefunded"],
            default: "Pending",
          },
          refundedAmount: { type: "number", default: 0 },
          refunds: {
            type: "array",
            items: {
              type: "object",
              properties: {
                refundId: { type: "string" },
                amount: { type: "number" },
                date: { type: "string", format: "date-time" },
                reason: { type: "string" },
              },
            },
          },
          stripeSessionId: { type: "string" },
          stripePaymentIntentId: { type: "string" },
          details: {
            type: "object",
            properties: {
              bookingType: {
                type: "string",
                enum: [
                  "Flight",
                  "Hotel",
                  "Trip",
                  "FlightAndHotel",
                  "Mixed",
                ],
              },
            },
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Guest: {
        type: "object",
        required: [
          "type",
          "firstName",
          "lastName",
          "nationality",
          "passportNumber",
          "dateOfBirth",
          "expiryDate",
        ],
        properties: {
          type: {
            type: "string",
            enum: ["adult", "child", "infant"],
            description:
              "Guest type. Booking middleware currently enforces the adult/infant ratio.",
          },
          firstName: {
            type: "string",
            description: "Guest's first name (will be converted to uppercase)",
          },
          lastName: {
            type: "string",
            description: "Guest's last name (will be converted to uppercase)",
          },
          nationality: {
            type: "string",
            enum: ["USA", "EG", "EURO"],
            example: "EG",
            description:
              "Guest nationality code used by booking creation to derive the checkout currency (`EG` -> `EGP`, `USA` -> `USD`, `EURO` -> `EUR`).",
          },
          passportNumber: {
            type: "string",
            description:
              "Passport number in one of the supported formats: Egypt (2 letters + 7 digits), USA (9 digits), Saudi Arabia (1 letter + 7 digits), or Europe (1 letter + 8 digits).",
            oneOf: [
              { pattern: "^[A-Z]{2}[0-9]{7}$" },
              { pattern: "^[0-9]{9}$" },
              { pattern: "^[A-Z]{1}[0-9]{7}$" },
              { pattern: "^[A-Z]{1}[0-9]{8}$" },
            ],
          },
          expiryDate: {
            type: "string",
            format: "date",
            description:
              "Passport expiry date. Must be valid (not expired) and valid for at least 6 months from today",
          },
          dateOfBirth: {
            type: "string",
            format: "date",
            description:
              "Guest date of birth. Required by the guest schema even though booking middleware does not validate age buckets.",
          },
        },
      },
      BookingRequest: {
        type: "object",
        required: ["guests", "PassportNumber", "totalPrice", "items"],
        properties: {
          guests: {
            type: "array",
            minItems: 1,
            items: { $ref: "#/components/schemas/Guest" },
            description:
              "Array of guests with passport details. Each infant must have an adult",
          },
          flight: {
            type: "object",
            description:
              "Optional flight booking details. At least one of `flight`, `hotel`, or `trip` must be supplied.",
          },
          hotel: {
            type: "object",
            description:
              "Optional hotel booking details. At least one of `flight`, `hotel`, or `trip` must be supplied.",
          },
          trip: {
            type: "array",
            items: { type: "string" },
            description:
              "Optional trip IDs. At least one of `flight`, `hotel`, or `trip` must be supplied.",
          },
          PassportNumber: {
            type: "string",
            description:
              "Primary passport number stored on the booking document in addition to guest passport details.",
          },
          totalPrice: {
            type: "number",
            minimum: 0.01,
            description: "Total booking price (must be greater than 0)",
          },
          currency: {
            type: "string",
            default: "EGP",
            description:
              "Optional preferred currency. The booking controller may override this using the first guest nationality mapping.",
          },
          items: {
            type: "array",
            description: "Items for Stripe checkout",
            items: {
              type: "object",
              required: ["name", "price", "quantity"],
              properties: {
                name: { type: "string" },
                description: { type: "string" },
                price: { type: "number" },
                quantity: { type: "integer", minimum: 1 },
                image: {
                  type: "string",
                  format: "uri",
                  description:
                    "Public image URL used by Stripe checkout. Provide a valid URL when available.",
                },
              },
            },
          },
        },
      },
      StripeCheckoutRequest: {
        type: "object",
        required: ["items", "bookingId", "email"],
        properties: {
          bookingId: {
            type: "string",
            description: "MongoDB ObjectId of the booking being checked out",
          },
          email: {
            type: "string",
            format: "email",
            description:
              "Customer email used to prefill the Stripe checkout session.",
          },
          items: {
            type: "array",
            description: "Array of items to checkout",
            items: {
              type: "object",
              required: ["name", "price", "quantity"],
              properties: {
                name: { type: "string", description: "Item name" },
                description: {
                  type: "string",
                  description: "Item description",
                },
                image: {
                  type: "string",
                  description: "Item image URL",
                },
                price: {
                  type: "number",
                  description:
                    "Item price in the booking currency (will be multiplied by 100 for Stripe)",
                },
                quantity: {
                  type: "integer",
                  minimum: 1,
                  description: "Item quantity",
                },
              },
            },
          },
        },
      },
    },
  },
  paths: {
    "/": {
      get: {
        tags: ["Auth"],
        summary: "API root endpoint",
        responses: {
          200: {
            description: "Welcome message",
          },
        },
      },
    },
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        description:
          "Creates a user and sets `x-auth-token` and `x-refresh-token` cookies on success.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterRequest" },
            },
          },
        },
        responses: {
          201: { description: "User registered successfully" },
          400: { description: "Validation failed" },
          500: { description: "Server error" },
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login a user",
        description:
          "Authenticates a user and sets `x-auth-token` and `x-refresh-token` cookies on success.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AuthRequest" },
            },
          },
        },
        responses: {
          200: { description: "Login successful" },
          401: { description: "Invalid credentials" },
        },
      },
    },
    "/api/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Logout the current user",
        description: "Clears the `x-auth-token` and `x-refresh-token` cookies.",
        responses: {
          200: { description: "Logged out successfully" },
        },
      },
    },
    "/api/auth/refresh": {
      post: {
        tags: ["Auth"],
        summary: "Refresh authentication tokens",
        security: [{ refreshCookie: [] }],
        description:
          "Reads the `x-refresh-token` cookie, rotates it, and issues fresh auth cookies.",
        responses: {
          200: { description: "Token refreshed" },
          401: { description: "Refresh token missing or invalid" },
          500: { description: "Internal server error" },
        },
      },
    },
    "/api/auth/verify-email": {
      get: {
        tags: ["Auth"],
        summary: "Verify email address",
        parameters: [
          {
            in: "query",
            name: "token",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Email verified" },
          400: { description: "Missing token" },
          404: { description: "User not found for token" },
        },
      },
    },
    "/api/auth/reset-password": {
      post: {
        tags: ["Auth"],
        summary: "Send password reset email",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/EmailRequest" },
            },
          },
        },
        responses: {
          200: { description: "Reset email sent" },
          400: { description: "Email is required" },
          404: { description: "User not found" },
          500: { description: "Internal server error" },
        },
      },
    },
    "/api/auth/reset-password-confirm": {
      post: {
        tags: ["Auth"],
        summary: "Reset password using token",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ResetPasswordRequest" },
            },
          },
        },
        responses: {
          200: { description: "Password reset successful" },
          400: { description: "Invalid or expired token" },
          500: { description: "Internal server error" },
        },
      },
    },
    "/api/auth/continueWithGoogle": {
      get: {
        tags: ["Auth"],
        summary: "Start Google OAuth flow",
        responses: {
          302: { description: "Redirects to Google" },
        },
      },
    },
    "/api/auth/google/callback": {
      get: {
        tags: ["Auth"],
        summary: "Google OAuth callback",
        responses: {
          302: { description: "Redirects to frontend" },
        },
      },
    },
    "/api/Trip": {
      get: {
        tags: ["Trips"],
        summary: "Get all trips",
        responses: {
          201: { description: "Trips fetched successfully" },
          500: { description: "Server error" },
        },
      },
    },
    "/api/Trip/addTrip": {
      post: {
        tags: ["Trips"],
        summary: "Create a new trip",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: { $ref: "#/components/schemas/CreateTripRequest" },
            },
          },
        },
        responses: {
          201: { description: "Trip created successfully" },
          400: { description: "Missing fields or image" },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden" },
          500: { description: "Server error" },
        },
      },
    },
    "/api/Trip/{id}": {
      get: {
        tags: ["Trips"],
        summary: "Get trip by id",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          201: { description: "Trip fetched successfully" },
          404: { description: "Trip not found" },
          500: { description: "Server error" },
        },
      },
    },
    "/api/Trip/updateTrip/{id}": {
      put: {
        tags: ["Trips"],
        summary: "Update trip by id",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: { $ref: "#/components/schemas/CreateTripRequest" },
            },
          },
        },
        responses: {
          201: { description: "Trip updated successfully" },
          400: { description: "Missing image" },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden" },
          404: { description: "Trip not found" },
          500: { description: "Server error" },
        },
      },
    },
    "/api/Trip/deleteTrip/{id}": {
      delete: {
        tags: ["Trips"],
        summary: "Delete trip by id",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          201: { description: "Trip deleted successfully" },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden" },
          404: { description: "Trip not found" },
          500: { description: "Server error" },
        },
      },
    },
    "/api/flight/search": {
      post: {
        tags: ["Flights"],
        summary: "Search available flights",
        description:
          "Public flight search endpoint. Validates origin format, checks departure date and adult count, and restricts destination to supported Egyptian airport codes before querying Amadeus. Optional `children`, `infants`, `returnDate`, and `travelClass` are forwarded when provided.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/FlightSearchRequest" },
            },
          },
        },
        responses: {
          201: { description: "Flight offers returned" },
          400: { description: "Missing parameters or validation failed" },
          502: {
            description: "Upstream flight provider temporarily unavailable",
          },
          500: { description: "Flight search failed" },
        },
      },
    },
    "/api/flight/details": {
      post: {
        tags: ["Flights"],
        summary: "Get flight details",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  flightOffer: { type: "object" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Flight details returned" },
          500: { description: "Server error" },
        },
      },
    },
    "/api/flight/price": {
      post: {
        tags: ["Flights"],
        summary: "Price a flight offer",
        security: [{ cookieAuth: [] }],
        description:
          "This route is implemented as GET, but both the validation middleware and the controller currently read values from the request body. In practice, the request body must include `flightOffer` plus `origin`, `destination`, `departureDate`, and `adults` to satisfy the middleware chain.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/FlightPriceRequest" },
            },
          },
        },
        responses: {
          200: { description: "Flight priced successfully" },
          400: { description: "Missing flight offer" },
          401: { description: "Unauthorized" },
          500: { description: "Flight pricing failed" },
        },
      },
    },
    "/api/hotels/search": {
      post: {
        tags: ["Hotels"],
        summary: "Search hotel offers by city",
        security: [{ cookieAuth: [] }],
        description:
          "Requires the authenticated user cookie and a supported Egyptian city code.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/HotelSearchRequest" },
            },
          },
        },
        responses: {
          201: { description: "Hotel offers returned" },
          400: { description: "Missing parameters" },
          404: { description: "No hotels or offers found" },
          401: { description: "Unauthorized" },
          500: { description: "Hotel search failed" },
        },
      },
    },
    "/api/hotels/getOneHotelDetails": {
      get: {
        tags: ["Hotels"],
        summary: "Get hotel offer details",
        security: [{ cookieAuth: [] }],
        description:
          "This route is implemented as GET, but the controller currently expects `hotelId`, `checkInDate`, `checkOutDate`, and `adults` in the request body after auth middleware succeeds.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/HotelOfferRequest" },
            },
          },
        },
        responses: {
          200: { description: "Hotel details returned" },
          400: { description: "Missing parameters" },
          401: { description: "Unauthorized" },
          500: { description: "Hotel details lookup failed" },
        },
      },
    },
    "/api/contact": {
      post: {
        tags: ["Contact"],
        summary: "Submit contact form",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ContactRequest" },
            },
          },
        },
        responses: {
          201: { description: "Contact saved" },
          400: { description: "Missing fields" },
          500: { description: "Server error" },
        },
      },
    },
    "/api/contact/contacts": {
      get: {
        tags: ["Contact"],
        summary: "Get all contact messages",
        security: [{ cookieAuth: [] }],
        responses: {
          201: { description: "Contacts returned" },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden" },
          500: { description: "Server error" },
        },
      },
    },
    "/api/contact/contacts/{name}": {
      get: {
        tags: ["Contact"],
        summary: "Get contact by name",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "name",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          201: { description: "Contact returned" },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden" },
          404: { description: "Contact not found" },
          500: { description: "Server error" },
        },
      },
    },
    "/api/blog": {
      post: {
        tags: ["Blogs"],
        summary: "Create a blog post",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: { $ref: "#/components/schemas/CreateBlogRequest" },
            },
          },
        },
        responses: {
          201: { description: "Blog created" },
          400: { description: "Missing fields or images" },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden" },
          500: { description: "Server error" },
        },
      },
      get: {
        tags: ["Blogs"],
        summary: "Get all blogs",
        responses: {
          201: { description: "Blogs returned" },
          500: { description: "Server error" },
        },
      },
    },
    "/api/blog/{blogId}": {
      get: {
        tags: ["Blogs"],
        summary: "Get a blog by id",
        parameters: [
          {
            in: "path",
            name: "blogId",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Blog returned" },
          404: { description: "Blog not found" },
          500: { description: "Server error" },
        },
      },
    },
    "/api/blog/updateBlog/{blogId}": {
      put: {
        tags: ["Blogs"],
        summary: "Update a blog by id",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "blogId",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  content: { type: "string" },
                  image: { type: "string", format: "binary" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Blog updated" },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden" },
          404: { description: "Blog not found" },
          500: { description: "Server error" },
        },
      },
    },
    "/api/blog/deleteBlog/{blogId}": {
      delete: {
        tags: ["Blogs"],
        summary: "Delete a blog by id",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "blogId",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          201: { description: "Blog deleted" },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden" },
          404: { description: "Blog not found" },
          500: { description: "Server error" },
        },
      },
    },
    "/api/booking/create": {
      post: {
        tags: ["Bookings"],
        summary: "Create a unified booking and initiate Stripe checkout",
        description:
          "Creates a new booking for the authenticated user, persists the booking, and immediately creates a Stripe checkout session from the supplied `items`. Returns the new booking ID and Stripe checkout URL. Booking is created with `Pending` status until `/api/payments/success` is called by Stripe. Validation includes: at least one booking type (`flight`, `hotel`, or `trip`), valid guest fields, supported passport formats, no duplicate passport numbers in the same booking, passports not expired, passports valid for at least 6 months, and no more infants than adults.",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/BookingRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Booking created successfully with checkout URL",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    status: { type: "string" },
                    bookingId: { type: "string" },
                    checkoutUrl: { type: "string" },
                  },
                },
              },
            },
          },
          400: {
            description:
              "Booking validation failed. Possible errors include missing booking type, missing passport number, missing or invalid guest fields, invalid passport format, duplicate passport numbers, expired passport, passport not valid for 6+ months, missing checkout items, invalid total price, or more infants than adults.",
          },
          401: { description: "Unauthorized - User not authenticated" },
          403: { description: "Forbidden" },
          500: { description: "Booking creation or checkout failed" },
        },
      },
    },
    "/api/booking/refund/{bookingId}": {
      get: {
        tags: ["Bookings"],
        summary: "Cancel a booking and process refund if applicable",
        description:
          "Cancels a booking for the authenticated user. If the booking has already been paid and a Stripe payment intent exists, the endpoint attempts a Stripe refund before marking the booking as cancelled.",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "bookingId",
            required: true,
            schema: { type: "string" },
            description: "MongoDB ObjectId of the booking to cancel",
          },
        ],
        responses: {
          200: {
            description:
              "Booking cancelled successfully, with or without Stripe refund depending on payment state",
          },
          400: {
            description: "Booking is already cancelled or cannot be cancelled",
          },
          401: { description: "Unauthorized" },
          404: { description: "Booking not found" },
          500: { description: "Failed to cancel booking or process refund" },
        },
      },
    },
    "/api/payments/stripe-checkout": {
      post: {
        tags: ["Payments"],
        summary: "Create a Stripe checkout session",
        description:
          "Creates a Stripe checkout session for an existing booking using the booking currency stored in MongoDB. This route is the same helper used internally by booking creation, but when called directly it expects `bookingId`, `email`, and `items` in the request body.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/StripeCheckoutRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Stripe checkout session created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    url: {
                      type: "string",
                      description: "Stripe-hosted checkout URL",
                    },
                    customer_email: {
                      type: "string",
                      format: "email",
                    },
                    payment_status: { type: "string" },
                    metadata: {
                      type: "object",
                      properties: {
                        BookingId: {
                          type: "string",
                          description: "MongoDB ObjectId of the booking",
                        },
                        Email: { type: "string", format: "email" },
                      },
                    },
                  },
                },
              },
            },
          },
          400: { description: "Invalid checkout request or missing booking" },
          500: { description: "Stripe checkout creation failed" },
        },
      },
    },
    "/api/payments/success": {
      get: {
        tags: ["Payments"],
        summary: "Handle successful Stripe payment",
        description:
          "Stripe redirects to this endpoint after successful checkout. The handler reads `session_id`, retrieves the Stripe session, updates the booking status to `Confirmed`, sets payment status to `Paid`, stores Stripe IDs, and then redirects the browser to the frontend checkout success page.",
        parameters: [
          {
            in: "query",
            name: "session_id",
            required: true,
            schema: { type: "string" },
            description: "Stripe checkout session ID returned by Stripe",
          },
        ],
        responses: {
          302: { description: "Redirect to checkout success page" },
          400: { description: "Failed to retrieve payment session" },
          500: { description: "Failed to confirm payment" },
        },
      },
    },
    "/api/adminDashboard/AllUsers": {
      get: {
        tags: ["Admin"],
        summary: "Get all users",
        security: [{ cookieAuth: [] }],
        responses: {
          200: { description: "Users returned" },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden" },
        },
      },
    },
    "/api/adminDashboard/upgradeUser/{userId}": {
      patch: {
        tags: ["Admin"],
        summary: "Update a user's role",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "userId",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RoleUpdateRequest" },
            },
          },
        },
        responses: {
          200: { description: "Role updated" },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden" },
          500: { description: "Server error" },
        },
      },
    },
    "/api/adminDashboard/bookingDetails": {
      get: {
        tags: ["Admin"],
        summary: "Get booking details for admin",
        security: [{ cookieAuth: [] }],
        responses: {
          200: { description: "Bookings returned" },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden" },
          500: { description: "Server error" },
        },
      },
    },
    "/api/adminDashboard/stats/trips": {
      get: {
        tags: ["Admin"],
        summary: "Get trips dashboard stats",
        security: [{ cookieAuth: [] }],
        responses: {
          200: { description: "Trip stats returned" },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden" },
          500: { description: "Server error" },
        },
      },
    },
    "/api/adminDashboard/stats/blogs": {
      get: {
        tags: ["Admin"],
        summary: "Get blog dashboard stats",
        security: [{ cookieAuth: [] }],
        responses: {
          200: { description: "Blog stats returned" },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden" },
          500: { description: "Server error" },
        },
      },
    },
    "/api/adminDashboard/stats/revenue": {
      get: {
        tags: ["Admin"],
        summary: "Get total revenue stats",
        security: [{ cookieAuth: [] }],
        responses: {
          200: { description: "Revenue stats returned" },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden" },
          500: { description: "Server error" },
        },
      },
    },
    "/api/userdashboard/BookedTrips": {
      get: {
        tags: ["User Dashboard"],
        summary: "Get booked trips for the current cookie user",
        description:
          "This endpoint reads the `userId` cookie directly and does not use the standard auth middleware.",
        security: [{ userIdCookie: [] }],
        responses: {
          200: { description: "Booked trips returned" },
          401: { description: "Unauthorized" },
          500: { description: "Error fetching booked trips" },
        },
      },
    },
    "/api/userdashboard/savedTrips": {
      get: {
        tags: ["User Dashboard"],
        summary: "Get saved trips for the current cookie user",
        description:
          "This endpoint reads the `userId` cookie directly and does not use the standard auth middleware.",
        security: [{ userIdCookie: [] }],
        responses: {
          200: { description: "Saved trips returned" },
          401: { description: "Unauthorized" },
          500: { description: "Error fetching saved trips" },
        },
      },
    },
    "/api/userdashboard/saveTrips/{tripId}": {
      post: {
        tags: ["User Dashboard"],
        summary: "Save a trip for the current user",
        description:
          "This endpoint reads the `userId` cookie directly and does not use the standard auth middleware.",
        security: [{ userIdCookie: [] }],
        parameters: [
          {
            in: "path",
            name: "tripId",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Trip saved" },
          401: { description: "Unauthorized" },
          500: { description: "Error saving trip" },
        },
      },
    },
    "/api/userdashboard/AddProfilePicture": {
      patch: {
        tags: ["User Dashboard"],
        summary: "Update user profile picture",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  profilePicture: { type: "string", format: "binary" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Profile picture updated" },
          401: { description: "Unauthorized" },
          500: { description: "Server error" },
        },
      },
    },
    "/api/userdashboard/removeSavedTrip/{tripId}": {
      delete: {
        tags: ["User Dashboard"],
        summary: "Remove a saved trip for the current user",
        description:
          "This endpoint reads the `userId` cookie directly and does not use the standard auth middleware.",
        security: [{ userIdCookie: [] }],
        parameters: [
          {
            in: "path",
            name: "tripId",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Trip removed" },
          401: { description: "Unauthorized" },
          500: { description: "Error removing trip from saved trips" },
        },
      },
    },
    "/api/hiddenGem": {
      post: {
        tags: ["Hidden Gems"],
        summary: "Create a hidden gem",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["location", "reviews", "images"],
                properties: {
                  location: { type: "string" },
                  reviews: { type: "string" },
                  images: {
                    type: "array",
                    items: { type: "string", format: "binary" },
                  },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Hidden gem created" },
          400: { description: "Validation failed" },
          401: { description: "Unauthorized" },
          500: { description: "Server error" },
        },
      },
      get: {
        tags: ["Hidden Gems"],
        summary: "Get all hidden gems",
        responses: {
          200: { description: "Hidden gems returned" },
          500: { description: "Server error" },
        },
      },
    },
    "/api/hiddenGem/{id}": {
      get: {
        tags: ["Hidden Gems"],
        summary: "Get a hidden gem by id",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Hidden gem returned" },
          404: { description: "Hidden gem not found" },
          500: { description: "Server error" },
        },
      },
      put: {
        tags: ["Hidden Gems"],
        summary: "Update a hidden gem",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  location: { type: "string" },
                  reviews: { type: "string" },
                  images: {
                    type: "array",
                    items: { type: "string" },
                  },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Hidden gem updated" },
          401: { description: "Unauthorized" },
          404: { description: "Hidden gem not found" },
          500: { description: "Server error" },
        },
      },
      delete: {
        tags: ["Hidden Gems"],
        summary: "Delete a hidden gem by id",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Hidden gem deleted" },
          401: { description: "Unauthorized" },
          404: { description: "Hidden gem not found" },
          500: { description: "Server error" },
        },
      },
    },
    "/api/offerings": {
      post: {
        tags: ["Offerings"],
        summary: "Create an offering",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["title", "description", "image"],
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  reviews: { type: "string" },
                  price: { type: "number" },
                  image: {
                    type: "array",
                    items: { type: "string", format: "binary" },
                  },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Offering created" },
          400: { description: "Validation failed" },
          401: { description: "Unauthorized" },
          500: { description: "Server error" },
        },
      },
      get: {
        tags: ["Offerings"],
        summary: "Get all offerings",
        responses: {
          200: { description: "Offerings returned" },
          500: { description: "Server error" },
        },
      },
    },
    "/api/offerings/{id}": {
      get: {
        tags: ["Offerings"],
        summary: "Get an offering by id",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Offering returned" },
          404: { description: "Offering not found" },
          500: { description: "Server error" },
        },
      },
      put: {
        tags: ["Offerings"],
        summary: "Update an offering by id",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  reviews: { type: "string" },
                  price: { type: "number" },
                  image: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Offering updated" },
          401: { description: "Unauthorized" },
          404: { description: "Offering not found" },
          500: { description: "Server error" },
        },
      },
      delete: {
        tags: ["Offerings"],
        summary: "Delete an offering by id",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Offering deleted" },
          401: { description: "Unauthorized" },
          404: { description: "Offering not found" },
          500: { description: "Server error" },
        },
      },
    },
    "/api/guideDashboard/setGuideSchedule": {
      post: {
        tags: ["Guide Dashboard"],
        summary: "Set guide schedule availability",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  dayofweek: { type: "string" },
                  startTime: { type: "string" },
                  endTime: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Guide schedule updated successfully" },
          401: { description: "Unauthorized" },
          404: { description: "Guide not found" },
          500: { description: "Server error" },
        },
      },
    },
  },
};

module.exports = swaggerJSDoc({
  definition,
  apis: [],
});
