const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const PORT = process.env.PORT || 3000;
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

app.use(express.static(path.join(__dirname, "../../frontend/")));

// establishing routes
const authRoutes = require("./routes/authentication");
const gameRoutes = require("./routes/game.js");
const globalLobbyRoutes = require("./routes/global_lobby.js");
const createGameRoutes = require("./routes/create_game.js");
const landingRoutes = require("./routes/landing");
const signUpRoutes = require("./routes/sign_up");
const loginRoutes = require("./routes/login");

// mounting routerssss
app.use("/", landingRoutes);
app.use("/game", gameRoutes);
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
    response.render("hello"); // Render the "hello" EJS template
});

// startttturrr uppp
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});