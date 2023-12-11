const express = require("express");
const app = express;
const http = require("http");
const router = app.Router();
const websocket = require("socket.io");
const isAuthenticated = require("../middleware/authenticated");
const configureDatabase = require("../../db/db");

router.use(isAuthenticated);
const db = configureDatabase();

const server = http.createServer(app); 

const io = websocket(server);

router.get("/", (request, response) => {
    const user = request.session.user;

    response.render("active_games.ejs", { pageTitle: 'Active Games', loggedIn: request.session.loggedIn, user});
});

module.exports = router;
