const express = require("express");
const http = require("http");
const websocket = require("socket.io");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const PORT = process.env.PORT || 3000;
const requireLogin = require("../backend/middleware/reqLogin.js")
require("dotenv").config();


app.use(bodyParser.urlencoded({extended:true}));


//set up to use cookies
app.use(cookieParser());

app.use(
    session({
        secret: "key",
        resave: false,
        saveUninitialized: true,
    })
);

app.use(express.static(path.join(__dirname, "../frontend/")));

// establishing routes
const authRoutes = require("./routes/authentication");
const gameRoutes = require("./routes/game.js");
const activeGamesRoutes = require("./routes/active_games.js");
const globalLobbyRoutes = require("./routes/global_lobby.js");
const createGameRoutes = require("./routes/create_game.js");
const landingRoutes = require("./routes/landing");
const signUpRoutes = require("./routes/sign_up");
const loginRoutes = require("./routes/login");
const configureDatabase = require("../db/db.js");
const { config } = require("dotenv");

// mounting routerssss
app.use("/", landingRoutes);
app.use("/game", gameRoutes);
app.use("/activegames", activeGamesRoutes);
app.use("/lobby",globalLobbyRoutes);
app.use("/creategame",createGameRoutes);
app.use("/auth", authRoutes);
app.use("/signup",signUpRoutes);
app.use("/login", loginRoutes);
app.use("/auth", authRoutes);

// we are just setting views up views is in "views" dir and engine is ejs
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// this is how you set up a route like a link
app.get("/root/hello", (_request, response) => {
    response.render("hello"); 
});

const server = http.createServer(app); 

const io = new websocket.Server(server, {
    cors: {
        origin: process.env.NODE_ENV === "production" ? false:
        ["http://localhost:3000"]
    }
});



io.on("connection", (socket) => {
    console.log("A user connected");
    const db = configureDatabase();
    db.connect();

    db.query('LISTEN gamechat_channel');

    db.on('notification', async (notification) => {
        const gameCode = notification.payload;
        console.log('Received new message notification for game:', gameCode);
    
        const queryResult = await db.query(
            'SELECT * FROM gamechat WHERE game_id = $1 ORDER BY time_sent DESC LIMIT 1',
            [gameCode]
        );
    
        if (queryResult.rows.length > 0) {
            const latestMessage = queryResult.rows[0];
            const formattedMessage = {
                content: latestMessage.message,
                sender: latestMessage.user_id,
                timestamp: latestMessage.time_sent,
                gamecode: latestMessage.game_id,
            };
            io.emit('message', formattedMessage);
        }
    });
    

    socket.on("joinGame", (gamecode)=>{
        db.query("SELECT * FROM gamechat WHERE game_id = $1", [gamecode], (error, result) => {
            if (error) {
                console.error("Error getting gamechat messages", error);
            } else {
                const formattedMessages = result.rows.map((row) => ({
                    content: row.message,
                    sender: row.user_id,
                    timestamp: row.time_sent,
                    gamecode: row.game_id,
                }));
                socket.emit("previousMessages", formattedMessages);
            }
        })
    })

    socket.on("gamestartDB", (gamestartPayload) => {
        const { timestamp, gamecode } = gamestartPayload;
        db.query(
            "UPDATE game SET started_at = $1 WHERE game_code = $2",
            [timestamp, gamecode],
            (error, result) => {
                if (error) {
                    console.error("Error updating game start time:", error);
                } else {
                    console.log("Game start time updated successfully");
                }
            }
        );
        socket.emit("gamestarted", gamecode);
    });

    
    

    socket.on("messageToDB", (messageData) => {
        const content = messageData.content;
        const sender = messageData.sender;
        const timestamp = messageData.timestamp;
        const gamecode = messageData.gamecode;
    
        console.log('Connected to the database');
        db.query("INSERT INTO gamechat (user_id, game_id, message, time_sent) VALUES ($1, $2, $3 , $4)", [sender, gamecode, content, timestamp], (error, result) => {
            if (error) {
                console.error("Error saving message to the db:", error);
            } else {
                console.log('Message inserted successfully');
                // Check if the message is not from the local user, then emit to clients
                if (sender !== '<%= user.username.username %>') {
                    const formattedMessage = {
                        content: content,
                        sender: sender,
                        timestamp: timestamp,
                        gamecode: gamecode,
                    };
                }
            }
        });
    });
    

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});
// startttturrr uppp

server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});