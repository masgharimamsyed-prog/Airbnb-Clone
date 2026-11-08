const ExpressError = require("./ExpressError");

const wrapAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((err) => { next(new ExpressError("401", "issue while new adding...")) });
    }

}

module.exports = wrapAsync;