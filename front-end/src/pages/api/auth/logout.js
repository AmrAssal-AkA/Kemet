import axios from "axios";



async function hundler(req, res){
    if (req.method !== "POST"){
        return res.status(405).json({ message: "Method not allowed" });
    }

    try{
        const response = await axios.post("https://kemet-two.vercel.app/api/auth/logout",{},{
            headers: {Cookie: req.headers.cookie || "" },
            withCredentials: true,
        }
        )
        res.setHeader("Set-Cookie", [
            "x-auth-token=; Max-Age=0; Path=/; HttpOnly",
            "x-refresh-token=; Max-Age=0; Path=/; HttpOnly",
        ]);
        res.status(200).json({ message: "Logged out successfully" });
    }catch(error){
        console.error("Logout error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


export default hundler;