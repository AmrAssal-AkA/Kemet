module.exports = (req, res, nxt) => {
    if(req.user.role !== 'guide') {
        return res.status(403).json({ message: "Access denied. Guides only." });
    }
    nxt();
};