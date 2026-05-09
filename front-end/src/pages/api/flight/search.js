import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/flight/search`,
      req.body,
      {
        headers: {
          "Content-Type": "application/json",
          Cookie: req.headers.cookie || "",
        },
        withCredentials: true,
      },
    );

    return res.status(response.status).json(response.data);
  } catch (error) {
    if (error.code === "ECONNREFUSED") {
      return res.status(503).json({ message: "Flight service unavailable" });
    }

    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }

    return res.status(500).json({
      message: error.message || "Flight search failed",
    });
  }
}
