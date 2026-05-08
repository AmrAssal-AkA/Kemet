import axios from 'axios';


async function sendconstactus(req, res){
    if(req.method !== 'POST'){
        return res.status(405).json({message: 'Method not allowed'});
    }
    const {name, email, subject, message} = req.body;
    if(!name || !email || !subject || !message){
        return res.status(400).json({message: "Please fill all the fields"});
    }
    try{
        const response  = await axios.post("https://kemet-two.vercel.app/api/contact/", {
            name,
            email,
            subject,
            message
        });

        res.status(200).json(response.data);
    }catch(error){
        console.error("Error sending contact form:", error);
        res.status(500).json({message: "Server Error", error: error.message});
    }
}

export default sendconstactus;
