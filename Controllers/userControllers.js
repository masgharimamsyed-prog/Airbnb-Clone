const User = require("../models/User.js");



module.exports.FormToImplementation= async (req, res) => {
    try {

        let { username, email, password } = req.body;
        let newUser = new User({ username, email });
        let registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "SignUp successfully!");
            if (res.locals.redirectURL) {
                return res.redirect(`${res.locals.redirectURL}`);
            }
            res.redirect('/listings');
        });

    }
    catch (e) {
        req.flash("failure", `${e}`);
        res.redirect("/user/signup");
    }

}


module.exports.logOut=(req, res) => {
    if (!req.user) {
        req.flash("failure", "You are already logout");
        return res.redirect("/listings");
    }
    req.logOut((err) => {
        if (err) {
            req.flash("failure", "Logout failed!");
            return next(err);
        }
        req.flash("success", "Logout successfully!");
        if (res.locals.redirectURL) {
            return res.redirect(`${res.locals.redirectURL}`);
        }
        res.redirect("/listings");
    })

};

module.exports.loginFormtoWeb=async (req, res) => {
    req.flash("success", "Login successfully!");
    if (res.locals.redirectURL) {
        return res.redirect(res.locals.redirectURL);
    }
    res.redirect('/listings');

}