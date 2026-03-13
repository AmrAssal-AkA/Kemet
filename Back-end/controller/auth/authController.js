const User = require("../../model/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const { sendEmail } = require("../../services/miling");

// JWT
const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
  });
};

passport.serializeUser((user, done) => {
  done(null, user.userId);
});

passport.deserializeUser(async (userId, done) => {
  try {
    const user = await User.findOne({ userId });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, profilePhotos,done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = await User.findOne({ email: profile.emails[0].value });
          if (user) {
            user.googleId = profile.id;
            await user.save();
          } else {
            user = await User.create({
              name: profile.displayName,
              email: profile.emails[0].value,
              googleId: profile.id,
              profilePhoto: profilePhotos[0]?.url,
            });
          }
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);

// Register a new user (Sign Up)
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user.userId, user.role);
    res.status(201).json({
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: "User registered successfully",
    });

    // Send verification email
    const verifyURL = `${process.env.BASE_URL || "http://localhost:8000"}/auth/verify-email?token=${token}`;
    await sendEmail({
      to: user.email,
      subject: "Kemet Travel - Verify Your Email",
      html: `<p>Hello ${user.name},</p>
             <p>Thank you for registering. Please verify your email by clicking this link:</p>
             <a href="${verifyURL}">${verifyURL}</a>`,
      text: `Hello ${user.name},\n\nThank you for registering. Please verify your email by copying and pasting this link into your browser:\n${verifyURL}`,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Login user (Sign In)
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email }).select("+password");
    if (!existingUser) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Google-only users have no password
    if (!existingUser.password) {
      return res.status(401).json({
        message:
          "This account uses Google sign-in. Please continue with Google.",
      });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(existingUser.userId, existingUser.role);
    res.cookie("x-auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      user: {
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
      },
      message: `Login successful, welcome back ${existingUser.name}`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Logout (Sign Out)
const logout = (req, res) => {
  res.clearCookie("x-auth-token");
  res.status(200).json({ message: "Logged out successfully" });
};

const googleCallback = (req, res) => {
  try {
    const token = generateToken(req.user.userId, req.user.role);
    const user = encodeURIComponent(JSON.stringify({
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    }));
    res.redirect(`http://localhost:3000/login?token=${token}&user=${user}`);
  } catch (error) {
    res.redirect("http://localhost:3000/login?error=google_auth_failed");
  }
};

// Email Verification
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res
        .status(400)
        .json({ message: "Verification token is missing." });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findOne({ userId: decoded.userId });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found for verification." });
    }

    if (user.isVerified) {
      return res.status(200).send("<h1>Email has already been verified.</h1>");
    }

    user.isVerified = true;
    await user.save();

    res
      .status(200)
      .send("<h1>Email verified successfully! You can now log in.</h1>");
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(400).send("<h1>Invalid or expired verification link.</h1>");
  }
};

module.exports = { register, login, logout, googleCallback, verifyEmail };
