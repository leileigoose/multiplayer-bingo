const express = require("express");
const app = express;
const http = require("http");
const router = app.Router();
const websocket = require("socket.io");
const isAuthenticated = require("../middleware/authenticated");
const configureDatabase = require("../../db/db");

router.use(isAuthenticated);

router.get("/", async (request, response) => {
    const user = request.session.user;
    const player_id = user.username.username;
    const db = configureDatabase();
    await db.connect();

    const query = {
        text: `
        SELECT game.game_code, game.game_name 
        FROM game 
            JOIN player_card ON game.game_code = player_card.game_id 
            JOIN player ON player.username = player_card.player_id 
            WHERE player.username = $1;
        `,
        values: [player_id]
    };
    db.query(query, (error, result) => {
        if (error) {
            console.error("Error getting your games :(", error);
        } else {
            const active_games = result.rows;
            response.render("active_games.ejs", { pageTitle: 'Active Games', loggedIn: request.session.loggedIn, user, active_games});
        }
    });
});

module.exports = router;
