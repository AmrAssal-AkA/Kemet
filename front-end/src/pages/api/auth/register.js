import axios from "axios";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Name, email and password are required" });
  }

  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters long" });
  }
  try {
    const response = await axios.post(
      "http://localhost:8000/api/auth/register",
      { name, email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      },
    );
    const cookie = response.headers["set-cookie"];
    if (cookie) {
      res.setHeader("Set-Cookie", cookie);
    }

    return res.status(201).json(response.data);
  } catch (error) {
    console.error("Register Error:", error.message);
    console.error(
      "Register Error Details:",
      error.response?.data || error.message,
    );

    if (error.code === "ECONNREFUSED") {
      return res.status(503).json({ message: "Auth service unavailable" });
    }

    if (error.response) {
      console.error("Backend Response Status:", error.response.status);
      console.error("Backend Response Data:", error.response.data);
      return res.status(error.response.status).json(error.response.data);
    }

    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

export default handler;
