module.exports = (req, res, nxt) => {
  const flightDestination = [
    "CAI",
    "ALY",
    "HRG",
    "LXR",
    "ASW",
    "HBE",
    "PSD",
    "SKV",
    "TCP",
    "ELT",
    "MUH",
    "SPX",
  ];
  const origin = String(req.body.origin || "").trim().toUpperCase();
  const { destination } = req.body;

  if (!/^[A-Z]{3}$/.test(origin)) {
    return res.status(400).json({
      error: "Invalid origin. Please enter a valid 3-letter IATA airport code.",
    });
  }

  req.body.origin = origin;

  if (flightDestination.includes(destination)) {
    nxt();
  } else {
    res
      .status(400)
      .json({
        error: "Invalid destination. Please choose a valid Egyptian airport.",
      });
  }
};
