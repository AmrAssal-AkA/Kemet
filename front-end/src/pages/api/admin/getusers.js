import axios from "axios"


async function handler(req, res){
    if(req.method != 'GET'){
        res.status(405).json({message: 'Method not allowed'})
    }
    
    try{
        const response = await axios.get("http://localhost8000/api/adminDashboard/AllUsers", {
            headers: {
                Authorization: `Bearer ${req.cookies.token}`
            },
            withCredentials: true,
        })
        res.status(200).json(response.data)
    } catch (error) {
        res.status(500).json({message: 'Internal server error'})
    }
}


export default handler