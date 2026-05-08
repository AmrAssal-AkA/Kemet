import axios from "axios";



async function handler(req, res){
    if(req.method !== "GET"){
        res.status(405).json({message: "Method not allowed"});
        return;
    }
    const {blogId} = req.query;

    try{
        const response = await axios.get(`https://kemet-two.vercel.app/api/blog/${blogId}`, {
                withCredentials: true,
        });
        res.status(200).json(response.data);

    }catch(error){
        console.error("Error fetching blog:", error);
        res.status(500).json({message: "Internal server error"});
    }
}

export default handler;