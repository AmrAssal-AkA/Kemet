import axios from "axios";  

async function handler(req, res){
    if (req.method !== "POST") {
        res.status(405).json({ message: "Method not allowed" });
        return;
    }

    try{
        const response = await axios.post("http://localhost:8000/api/auth/refresh", {}, {
            headers: {Cookie: req.headers.cookie},
            withCredentials: true,
        })
        const cookies = response.headers["set-cookie"];
        if (cookies) {
            cookies.forEach(cookie => {
                res.setHeader("Set-Cookie", cookie);
            });
        }
        return res.status(200).json({ message: "Token refreshed successfully" });
    }catch(error){
        console.error("Error refreshing token:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export default handler;