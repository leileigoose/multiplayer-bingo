const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const path = require("path");
const PORT = process.env.PORT || 3000;
require("dotenv").config();

app.use(bodyParser.urlencoded({extended:true}));

// establishing routes
const authRoutes = require("./routes/authentication");
const gameRoutes = require("./routes/game");
const globalLobbyRoutes = require("./routes/global_lobby.js");
const landingRoutes = require("./routes/landing");
const signUpRoutes = require("./routes/sign_up");

// mounting routerssss
app.use("/", landingRoutes);
app.use("/games", gameRoutes);
app.use("/lobby",globalLobbyRoutes);
app.use("/auth", authRoutes);
app.use("/signup",signUpRoutes);



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
