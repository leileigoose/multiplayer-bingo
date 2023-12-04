const express = require("express");
const router = express.Router();

router.get("/", (_request, response) => {
    response.render("global_lobby.ejs", { pageTitle: "Lobby", pageContent: "Welcome" });
});


module.exports = router;
