
module.exports = (...role) => {
  return (req, res, nxt) => {
    if (!role.includes(req.user.role)) {
      return res.status(403).json({ message: "You are not authorized to perform this action" });
    }
    nxt();
  };
};
