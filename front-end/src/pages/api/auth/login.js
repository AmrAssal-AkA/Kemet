import axios from "axios";


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
      "http://localhost:8000/api/auth/login",
      {email, password},
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

    return res.status(200).json(response.data)

  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default handler;
