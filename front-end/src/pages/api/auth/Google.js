import axios from "axios";


async function handler(req, res){
    if (req.method !== "POST"){
        return res.status(405).json({ message: "Method not allowed" });
    }
    try{
        const response = await axios.get("http://localhost:8000/auth/continueWithGoogle", {
            headers: {
                "Content-Type": "application/json"
            }
        });
        const token = response.headers["x-auth-token"];
        if (token) res.setHeader("x-auth-token", token);
        res.status(response.status).json(response.data);
    }catch (error){
        if (error.response) { 
            return res.status(error.response.status).json(error.response.data);
        }
    }
}


export default handler;