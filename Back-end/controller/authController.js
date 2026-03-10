const User = require("../model/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");

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
      callbackURL: "http://localhost:8000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
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
    const { name, email, password, role } = req.body;

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
      role: role === "admin" ? "admin" : "user",
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
  } catch (error) {
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
    res.status(200).json({
      token,
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

module.exports = { register, login, logout, googleCallback };
