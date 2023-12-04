const express = require("express");
const router = express.Router();

router.get("/", (_request, response) => {
    response.render("landing.ejs", { pageTitle: "Home", pageContent: "Welcome" });
});

module.exports = router;