const express = require("express");
const router = express.Router();

router.get("/", (_request, response) => {
    const user = _request.session.user;
    response.render("global_lobby.ejs", { pageTitle: "Home", pageContent: "Welcome", loggedIn: _request.session.loggedIn, user});
});


module.exports = router;
