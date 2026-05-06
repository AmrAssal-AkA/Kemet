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
  const { destination } = req.body;

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
