import axios from "axios";

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { token, newPassword } = req.body;
  if (!newPassword) {
    return res.status(400).json({ message: "New password is required" });
  }
  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }
  console.log("proxy received token:", token, "and new password:", newPassword);
  try {
    const response = await axios.post(
      `http://localhost:8000/api/auth/reset-password-confirm`,
      { token, newPassword },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      },
    );
    return res.status(200).json(response.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
}

export default handler;
