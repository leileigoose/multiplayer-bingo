const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const configureDatabase = require("../../db/db");

const db = configureDatabase
router.get("/", (_request, response) => {
    const user = _request.session.user;
    response.render("create_game.ejs", { pageTitle: "Home", pageContent: "Welcome", loggedIn: _request.session.loggedIn, user});
});

router.post("/", async (request,response) =>  {
    const {gamename} = request.body;
    console.log(request.body);
    
    const gamecode = generateRandomCode(8);

    try {
        await create_game(gamecode, gamename);
        
        response.redirect(`/game/${gamecode}`);
    } catch (error) {
        console.error("Error creating game :(", error);
        response.status(500).send("Internal server error.");
    }
});

module.exports = router;

function generateRandomCode(len) {
    const bytes = crypto.randomBytes(Math.ceil(len/2));
    const code = bytes.toString('hex').slice(0, len);
    return code;
}

async function create_game(gamecode, gamename) {

    const db = configureDatabase();
    await db.connect();
    console.log("Code, Name, max players, password:", gamecode, gamename);
    const query = {
        text: "INSERT INTO game (game_code, game_name) VALUES ($1, $2)",
        values: [gamecode, gamename],
    };
    const result = await db.query(query);
    console.log("Game created successfully!");
}
