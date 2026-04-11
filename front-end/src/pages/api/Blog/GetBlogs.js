import axios from "axios";



async function handler(req,res){
    if(req.method != "GET"){
        res.status(405).json({message: "Method not allowed"});
    }
    try{
        const response = await axios.get("http://localhost:8000/api/blog/", {
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(req.body),
        })
        res.status(200).json(response.data);
    }catch(error){
        res.status(500).json({message: "Internal server error"});``
    }
}



export default handler;