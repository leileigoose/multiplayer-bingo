const express = require("express");
const router = express.Router();
const socketio = require("socket.io");
const requireLogin = require("../middleware/reqLogin");

const io = socketio(); 

router.get("/", requireLogin, (_request, response) => {
    const user = _request.session.user;

    if(user == null){
        return response.redirect("/login");
    }

    
    response.render("global_lobby.ejs", { pageTitle: "Home", pageContent: "Welcome", loggedIn: _request.session.loggedIn, user });
});

io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("message", (data) => {
        io.emit("message", data);
    });
    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

router.io = io;

module.exports = router;
