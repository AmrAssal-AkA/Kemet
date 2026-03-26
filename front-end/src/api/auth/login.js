import axios from "axios";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    const response = await axios.post(
      "http://localhost:8000/auth/login",
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

    if (data.token) {

      res.setHeader(
        "Set-Cookie",
        `x-auth-token=${data.token}; Path=/; HttpOnly; Secure; SameSite=Strict`
      );

      res.setHeader("X-Auth-Token", data.token);
      return res.status(200).json(data);
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
