import axios from "axios";

const API_BASE_URL = "https://kemet-gold.vercel.app/";


async function handler(req,res){
    if(req.method != "GET"){
        return res.status(405).json({message: "Method not allowed"});
    }
    try{
        const response = await axios.get(`${API_BASE_URL}/api/blog`, {
            headers: {
                "Content-Type": "application/json",
            },
        })
        res.status(200).json(response.data);
    }catch(error){
        res.status(error.response?.status || 500).json(error.response?.data || {message: "Internal server error"});
    }
}



export default handler;
