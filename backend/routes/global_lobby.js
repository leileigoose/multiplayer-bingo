const express = require("express");
const router = express.Router();

router.get("/", (_request, response) => {
    response.render("global_lobby.ejs");
});

module.exports = router;
