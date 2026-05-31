import axios from "axios";
import { getApiBaseUrl } from "@/utils/apiBaseUrl";

const API_BASE_URL = getApiBaseUrl();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { blogId } = req.query;

  if (!blogId) {
    return res.status(400).json({ message: "Blog ID is required" });
  }

  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/blog/like/${blogId}`,
      {},
      {
        headers: {
          Cookie: req.headers.cookie || "",
        },
      },
    );

    return res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message =
      error.response?.data?.message || error.message || "Internal server error";

    console.error("[api/blog/like] Error:", status, message);
    return res.status(status).json({ message });
  }
}
