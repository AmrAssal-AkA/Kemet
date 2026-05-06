module.exports=(err, req,res,nxt) => {
    for (let e in err){
        res.status(500).json({"Internal Server Error": err[e]});
    }
}
