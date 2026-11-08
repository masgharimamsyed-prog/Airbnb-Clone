module.exports.islogin = (req, res, next) => {


    if (!req.isAuthenticated()) {
        if (req.originalMethod === "GET") {
            // a normal page the user was trying to view
            req.session.redirectURL = req.originalUrl;
        } else if (req.params.id) {
            // a form submission (review, edit, delete): send them back to the listing
            req.session.redirectURL = `/listings/${req.params.id}`;
        }
        req.flash("failure", "You Must be Login to do this Action!");
        return res.redirect("/user/login");
    }
    next();
}