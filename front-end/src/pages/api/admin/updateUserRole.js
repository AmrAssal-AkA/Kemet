import axios from "axios";

const API_BASE_URL = "https://kemet-two.vercel.app/";

async function handler(req, res) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { userId, role } = req.body || {};

  if (!userId || !role) {
    return res.status(400).json({ message: "User ID and role are required" });
  }

  const endpoint = `${API_BASE_URL}/api/adminDashboard/upgradeUser/${userId}`;

  console.log("[updateUserRole API] endpoint URL:", endpoint);
  console.log("[updateUserRole API] payload:", { role });

  try {
    const response = await axios.patch(
      endpoint,
      { role },
      {
        headers: {
          "Content-Type": "application/json",
          Cookie: req.headers.cookie || "",
        },
      },
    );

    console.log("[updateUserRole API] response status:", response.status);
    console.log("[updateUserRole API] response body:", response.data);

    return res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const data = error.response?.data || {
      message: error.message || "User role could not be updated.",
    };

    console.error("[updateUserRole API] response status:", status);
    console.error("[updateUserRole API] response body:", data);

    return res.status(status).json(data);
  }
}

export default handler;
