const express = require("express");
const router = express.Router();
const socketio = require("socket.io");
const requireLogin = require("../middleware/reqLogin");
const configureDatabase = require("../../db/db");

const io = socketio(); 
const db = configureDatabase();

router.get("/", requireLogin, (_request, response) => {
    const user = _request.session.user;
    const games = getAllGames();
    getAllMessages();

    // db.query("SELECT * FROM messages", (error, results) => {
    //     if (error) {
    //         console.error("error db query messages:", error);
    //     } else {
    //         io.emit("start messages", results);
    //     }
    // });  

    if (games) {
        response.render("global_lobby.ejs", { pageTitle: "Home", pageContent: "Welcome", loggedIn: _request.session.loggedIn, user, games});
    } else {
        response.status(404).send("Game not found :(");
    }

    if(user == null){
        return response.redirect("/login");
    }
});

async function getAllGames() {
    console.log("Fetching all games...");
    const query = {
        text: "SELECT game_code FROM game;"
    };
    console.log("SQL Query:", query);

    try {
        const result = await db.query(query);
        console.log("WE DID IT");
        return result.rows;
    } catch (error) {
        console.error("Error executing query:", error);
        throw error; // Rethrow the error to propagate it to the calling function
    }
    
    // const result = await db.query(query);
    // console.log("WE DID IT");
    // console.log(result);

    // return result.rows;
}

async function getAllMessages() {
    console.log("Getting messages");
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
