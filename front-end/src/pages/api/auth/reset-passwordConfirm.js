import axios from "axios";

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    const response = await axios.post(
      `http://localhost:8000/api/auth/reset-password/${req.query.token}`,
      req.body,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const token = response.headers["x-auth-token"];
    res.status(response.status).json({ ...response.data, token });
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
}

export default handler;
