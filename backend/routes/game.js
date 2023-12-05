const express = require("express");
const router = express.Router();

router.get("/", (_request, response) => {
    const user = _request.session.user;
    const loggedIn = _request.session.loggedIn;
    response.render("game.ejs", { pageTitle: "Home", pageContent: "Welcome", loggedIn: _request.session.loggedIn, user});
});


module.exports = router;
