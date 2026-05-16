import axios from "axios";

const API_BASE_URL = "https://kemet-gold.vercel.app/";


async function handler(req, res){
    if(req.method !== "GET"){
        res.status(405).json({message: "Method not allowed"});
        return;
    }
    const {blogId} = req.query;

    try{
        const response = await axios.get(`${API_BASE_URL}/api/blog/${blogId}`, {
                withCredentials: true,
        });
        res.status(200).json(response.data);

    }catch(error){
        console.error("Error fetching blog:", error);
        res.status(error.response?.status || 500).json(error.response?.data || {message: "Internal server error"});
    }
}

export default handler;
