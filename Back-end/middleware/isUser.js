module.exports = (req, res, nxt) => {
    if(req.user.role !== 'user') {
        return res.status(403).json({ message: "Access denied. Users only." });
    }
    nxt();
};