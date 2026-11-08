module.exports.redirectURL = (req, res, next) => {
    res.locals.redirectURL = req.session.redirectURL;
    next();
}