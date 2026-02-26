
module.exports = (req,res, nxt) =>{
    const flightDestination = ["CAI", "ALY", "HRG", "LXR", "ASW", "HBE", "PSD", "SKV", "TCP", "ELT", "MUH", "SPX"];
    const {destination} = req.body;
    if(flightDestination.includes(destination)){
        nxt();
    }else{
        res.status(400).json({error: "Invalid destination. Please choose a valid Egyptian airport."});
    }
}

module.exports = (req, res, next) => {
  const { origin, destination, departureDate, adults } = req.body;
  const errors = [];

  if (!origin || origin.length !== 3) {
    errors.push('origin must be a valid 3-letter IATA code');
  }
  if (!destination || destination.length !== 3) {
    errors.push('destination must be a valid 3-letter IATA code');
  }
  if (!departureDate || !/^\d{4}-\d{2}-\d{2}$/.test(departureDate)) {
    errors.push('departureDate must be in YYYY-MM-DD format');
  }
  if (!adults || adults < 1 || adults > 9) {
    errors.push('adults must be between 1 and 9');
  }

  // Check if departure date is not in the past
  const today = new Date();
  const depDate = new Date(departureDate);
  if (depDate < today) {
    errors.push('departureDate cannot be in the past');
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }
  next();
};