const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  if (!user) {
    throw new Error("User is required to generate token");
  }
  const accessToken = jwt.sign(
    {id: user._id, userId: user.userId, email: user.email, name: user.name, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" },
  );
  const refreshToken = jwt.sign(
    {id: user._id, userId: user.userId, email: user.email, name: user.name, role: user.role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" },
  );

  return { accessToken, refreshToken };
};

module.exports = { generateToken };
