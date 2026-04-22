const User = require("../../model/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const session = require("express-session");
const crypto = require("crypto");

const {
  sendEmail,
  verifyEmailTemplate,
  GoogleSignInTemplate,
} = require("../../services/miling");
const { generateToken } = require("../../services/generateToken");
const { verifyToken } = require("../../services/verifyToken");
const RefreshToken = require("../../model/refreshTokenSchema");

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
              profilePhoto: profile.photos[0]?.value,
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
// Registration (Sign Up)
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const Newuser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const { accessToken, refreshToken } = generateToken(Newuser);

    await RefreshToken.create({
      userId: Newuser.userId,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    // Set tokens in HTTP-only cookies
    res.cookie("x-auth-token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });
    // Set refresh token in HTTP-only cookie
    res.cookie("x-refresh-token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const verifyToken = crypto.randomBytes(32).toString("hex");
    await User.findByIdAndUpdate(Newuser._id, {
      emailVerificationToken: verifyToken,
      emailVerificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000,
    });
    const verifyURL = `http://localhost:3000/auth/verifyaccount?token=${verifyToken}`;
    const emailResult = await verifyEmailTemplate(name, verifyURL);
    await sendEmail({
      to: email,
      subject: "Kemet Travel - Verify Your Email",
      html: emailResult,
    });
    res.status(201).json({
      user: {
        name: Newuser.name,
        email: Newuser.email,
        role: Newuser.role,
      },
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Register Error:", error.message);
    console.error("Register Error Stack:", error.stack);
    res.status(500).json({ message: "An internal server error occurred" });
  }
};

// Login (Sign In)
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Google-only users have no password
    if (!user.password) {
      return res.status(401).json({
        message:
          "This account uses Google sign-in. Please continue with Google.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const { accessToken, refreshToken } = generateToken(user);

    await RefreshToken.create({
      userId: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.cookie("x-auth-token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.cookie("x-refresh-token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: `Login successful, welcome back ${user.name}`,
    });
  } catch (error) {
    res.status(500).json({ message: "An internal server error occurred" });
  }
};

const googleCallback = async (req, res) => {
  try {
    const { accessToken, refreshToken } = generateToken(req.user);
    await RefreshToken.create({
      userId: req.user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    res.cookie("x-auth-token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.cookie("x-refresh-token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const user = JSON.stringify({
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    });

    res.redirect(
      `http://localhost:3000/auth/auth?token=${accessToken}&user=${user}`,
    );

    const emailResult = await GoogleSignInTemplate(req.user.name);
    await sendEmail({
      to: req.user.email,
      subject: "Kemet Travel - Google Sign-In Successful",
      html: emailResult,
    });
  } catch (error) {
    res.redirect("http://localhost:3000/auth/auth?error=google_auth_failed");
  }
};

// Email Verification
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res
        .status(400)
        .json({ success: false, message: "Verification token is missing." });
    }

    const user = await User.findOneAndUpdate(
      { 
        emailVerificationToken: token, 
        emailVerificationTokenExpires: { $gt: Date.now() } 
      },
      { 
        isVerified: true, 
        emailVerificationToken: undefined, 
        emailVerificationTokenExpires: undefined 
      },
      { new: true }
    );

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification link.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Email verified successfully! You can now log in.",
    });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const refresh = async (req, res) => {
  const refreshToken = req.cookies["x-refresh-token"];

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token missing" });
  }
  try {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          await RefreshToken.deleteOne({ token: refreshToken });
          return res.status(401).json({ message: "Invalid refresh token" });
        }

        await RefreshToken.deleteOne({ token: refreshToken });
        const user = await User.findById(decoded.id);

        if (!user) {
          return res.status(401).json({ message: "User not found" });
        }

        const { accessToken, refreshToken: newRefreshToken } =
          generateToken(user);

        await RefreshToken.create({
          userId: user._id,
          token: newRefreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        res.cookie("x-auth-token", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          maxAge: 24 * 60 * 60 * 1000,
        });
        res.cookie("x-refresh-token", newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
          message: "Token refreshed successfully",
          user: {
            name: user.name,
            email: user.email,
            role: user.role,
          },
        });
      },
    );
  } catch (error) {
    res.status(500).json({ message: "An internal server error occurred" });
  }
};

module.exports = { register, login, googleCallback, verifyEmail, refresh };
