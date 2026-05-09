import axios from "axios";
import multer from "multer";
import FormData from "form-data";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const config = {
  api: {
    bodyParser: false,
  },
};

const upload = multer({ storage: multer.memoryStorage() });

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await runMiddleware(req, res, upload.array("images", 5));

    const { title, content, userId } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    if (!userId) {
      return res
        .status(401)
        .json({ message: "User ID is required" });
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);

    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        formData.append("images", file.buffer, {
          filename: file.originalname,
          contentType: file.mimetype,
        });
      });
    }

    const response = await axios.post(
      `${API_BASE_URL}/api/blog`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Cookie: req.headers.cookie,
        },
      },
    );

    return res.status(201).json(response.data);
  } catch (error) {
    console.error(
      "Error processing request:",
      error.response?.status,
      error.response?.data || error.message,
    );
    const errorMessage =
      error.response?.data?.message || error.message || "Internal server error";
    return res
      .status(error.response?.status || 500)
      .json({ message: errorMessage });
  }
}
