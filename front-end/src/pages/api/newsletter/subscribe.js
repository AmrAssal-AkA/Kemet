import axios from "axios";

const Backend_URL = process.env.Backend_URL || "http://localhost:8000";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { email } = req.body;
    
    if (!email || typeof email !== "string") {
        return res.status(400).json({ message: "Invalid email" });
    }

    try{
        const response = await axios.post(`${Backend_URL}/api/newsletter/subscribe`, { email });
        return res.status(200).json({ message: "Subscribed successfully" , response: response.data});
    }catch(error) {
console.error("Newsletter subscription error:", {
        message: error.message,
        status: error.response?.status,
        backendError: error.response?.data,
    });
    return res.status(error.response?.status || 500).json({ 
        message: error.response?.data?.message || "Internal server error"
    });
    }
}