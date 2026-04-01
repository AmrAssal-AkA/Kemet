import axios from "axios";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    const response = await axios.post(
      "http://localhost:8000/api/auth/login",
      req.body,
      {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
        credentials: "include",
      },
    );

    const data = await response.data;
    const token = response.headers["x-auth-token"];
    if (token) {
      res.setHeader("x-auth-token", token);
    }

    return res.status(200).json(data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default handler;
