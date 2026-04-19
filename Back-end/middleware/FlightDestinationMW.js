module.exports = (req,res, nxt) =>{
    const flightDestination = ["CAI", "ALY", "HRG", "LXR", "ASW", "HBE", "PSD", "SKV", "TCP", "ELT", "MUH", "SPX", "TCP", "ASW", "HBE", "PSD", "SKV", "ELT", "MUH", "SPX"];
    const {destination} = req.body;
    console.log("Flight Destination Middleware - Destination:", destination);
    if(flightDestination.includes(destination)){
        nxt();
    }else{
        res.status(400).json({error: "Invalid destination. Please choose a valid Egyptian airport."});
    }
}