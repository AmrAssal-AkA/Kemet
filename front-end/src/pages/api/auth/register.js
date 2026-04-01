import axios from "axios";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    const response = await axios.post(
      "http://localhost:8000/api/auth/register",
      req.body,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    res.status(response.status).json(response.data);
    res.setHeader("x-auth-token", response.headers["x-auth-token"] || "");
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default handler;
