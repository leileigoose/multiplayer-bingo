const express = require("express");
const router = express.Router();
const configureDatabase = require("../../db/db");
const isAuthenticated = require("../middleware/authenticated");

router.use(isAuthenticated);
const db = configureDatabase();

router.get("/", (request, response) => {
    console.log(request.session.user); // Check the console to verify the user object
    const player_id = request.session.user.id;

    const active_games = getUserGames(player_id);

    if (active_games) {
        response.render("active_games.ejs", { pageTitle: 'Active Games', active_games, loggedIn: request.session.loggedIn });
    } else {
        response.status(404).send("No games found!");
    }
});


async function getUserGames(player_id) {
    console.log("Fetching YOUR games...");
    const query = {
        text: `
        SELECT game.game_code, game.game_name
        FROM game
        JOIN player_card ON game.id = player_card.game_id
        JOIN player ON player.id = player_card.player_id
        WHERE player.id = $1;
        `,
        values: [player_id],
    };

    const result = await db.query(query);
    console.log(result);

    return result.rows;
}

module.exports = router;
