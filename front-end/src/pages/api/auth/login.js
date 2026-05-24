import axios from "axios";

const API_BASE_URL =
  process.env.Backend_URL ||
  "http://localhost:8000";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/auth/login`,
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      },
    );

    const cookies = response.headers["set-cookie"];
    if (cookies) {
      res.setHeader("Set-Cookie", cookies);
    }

    return res.status(response.status).json(response.data);
  } catch (error) {
    if (error.code === "ECONNREFUSED") {
      return res.status(503).json({ message: "Auth service unavailable" });
    }

    if (error.response) {
      const cookies = error.response.headers?.["set-cookie"];
      if (cookies) {
        res.setHeader("Set-Cookie", cookies);
      }
      return res.status(error.response.status).json(error.response.data);
    }

    return res.status(500).json({ message: "Internal server error" });
  }
};

export default handler;
