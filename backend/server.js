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
const globalLobbyRoutes = require("./routes/global_lobby.js");
const landingRoutes = require("./routes/landing");
const signUpRoutes = require("./routes/sign_up");
const loginRoutes = require("./routes/login");
const configureDatabase = require("../db/db.js");
const { config } = require("dotenv");

// mounting routerssss
app.use("/", landingRoutes);
app.use("/game", gameRoutes);
app.use("/lobby",globalLobbyRoutes);
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

    socket.on("message", (messageData) => {
        const content = messageData.content;
        const sender = messageData.sender;
        const timestamp = messageData.timestamp;
        const db = configureDatabase();

        db.connect((err) => {
            if (err) {
                console.error('db connection error:', err);
            } else {
                console.log('Connected to the database');
                db.query("INSERT INTO messages (player_name, message_time, message_content) VALUES ($1, $2, $3)", [sender, timestamp, content], (error, result) => {
                    if (error) {
                        console.error("frror saving message to the db:", error);
                    } else {
                        console.log('message inserted good');
                        io.emit("message", messageData);
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
// startttturrr uppp

server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});