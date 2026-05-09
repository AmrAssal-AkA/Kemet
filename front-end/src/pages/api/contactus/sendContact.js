import axios from 'axios';

const API_BASE_URL = "https://kemet-gold.vercel.app/";

async function sendconstactus(req, res){
    if(req.method !== 'POST'){
        return res.status(405).json({message: 'Method not allowed'});
    }
    const {name, email, subject, message} = req.body;
    if(!name || !email || !subject || !message){
        return res.status(400).json({message: "Please fill all the fields"});
    }
    try{
        const response  = await axios.post(`${API_BASE_URL}/api/contact`, {
            name,
            email,
            subject,
            message
        });

        res.status(response.status).json(response.data);
    }catch(error){
        console.error("Error sending contact form:", error);
        res.status(error.response?.status || 500).json(error.response?.data || {message: "Server Error", error: error.message});
    }
}

export default sendconstactus;
