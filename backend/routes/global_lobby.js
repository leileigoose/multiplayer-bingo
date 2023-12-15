const express = require("express");
const router = express.Router();
const socketio = require("socket.io");
const requireLogin = require("../middleware/reqLogin");
const configureDatabase = require("../../db/db");

const io = socketio(); 
const db = configureDatabase();
router.get("/", requireLogin, async (_request, response) => {
    const user = _request.session.user;
    getAllMessages();

    const query = "SELECT game_code, game_name FROM game;";
    db.query(query, (error, result) => {
            if (error) {
                console.error("Error getting games :(", error);
                return null;
            } else {
                const games = result.rows;
                response.render("global_lobby.ejs", { pageTitle: "Home", pageContent: "Welcome", loggedIn: _request.session.loggedIn, user, games});
            }
    });

    // db.query("SELECT * FROM messages", (error, results) => {
    //     if (error) {
    //         console.error("error db query messages:", error);
    //     } else {
    //         io.emit("start messages", results);
    //     }
    // });  
    // console.log(games);
    // if (games) {
    //     response.render("global_lobby.ejs", { pageTitle: "Home", pageContent: "Welcome", loggedIn: _request.session.loggedIn, user, games});
    // } else {
    //     response.status(404).send("Games not found :(");
    // }

    if(user == null){
        return response.redirect("/login");
    }
});

async function getAllMessages() {
    console.log("Getting messages");
    const db = configureDatabase();
    await db.connect();
    db.query("SELECT * FROM messages", (error, results) => {
        if (error) {
            console.error("error db query messages:", error);
        } else {
            io.emit("start messages", results);
        }
    }); 
}

io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("message", (data) => {

        const { content, sender, timestamp } = data;

        db.connect((err) => {
            if (err) {
                console.error('Database connection error:', err);
            } else {
                console.log('Connected to the database');
    
                db.query("INSERT INTO messages (player_name, message_time, message_content) VALUES ($1, $2, $3)", [sender, timestamp, content], (error, result) => {
                    if (error) {
                        console.error("Error saving message to the database:", error);
                    } else {
                        console.log('Message inserted successfully');
                        io.emit("message", data);
                    }
    
                    db.end();
                });
            }
        });
    });
    

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

router.io = io;

module.exports = router;
