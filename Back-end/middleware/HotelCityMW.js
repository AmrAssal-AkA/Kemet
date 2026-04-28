module.exports = (req, res, nxt) => {
  const { cityCode } = req.body;
  const allowedCities = [
    "CAI", // Cairo
    "ALY", // Alexandria
    "HRG", // Hurghada
    "LXR", // Luxor
    "ASW", // Aswan
    "PSD", // Port Said 
    "SKV", // St. Catherine
    "TCP", // Taba
    "ELT", // El-Tor
    "MUH", // Marsa Matruh
    "SSH", // Sharm El Sheikh
    "RMF", // Marsa Alam
    "DBB", // Dabaa
  ];
  if (allowedCities.includes(cityCode)) {
    nxt();
  } else {
    res.status(400).json({
      error: "Invalid city code. Please choose a valid Egyptian city.",
    });
  }
};
