const express = require("express");
const app = express;
const http = require("http");
const router = app.Router();
const websocket = require("socket.io");
const isAuthenticated = require("../middleware/authenticated");

router.use(isAuthenticated);

router.get("/", async (request, response) => {
    const user = request.session.user;
    const player_id = user.username.username;

    response.render("active_games.ejs", { pageTitle: 'Active Games', loggedIn: request.session.loggedIn, user});
    
    
});

module.exports = router;
