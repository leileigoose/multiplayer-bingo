const express = require("express");
const router = express.Router();
const PlayerCard = require("../models/playercard.model");

// Where the card gets generated for each player

function makeCard (username, game_code) {
    const query = {
        text: "INSERT INTO player_card (game_id, player_id, is_winner) VALUES ($gamecode, $username, false)",
        values: [game_code, username],
    }
    const result = db.query(query);

    return new PlayerCard(result.rows[0]); 

};

// function generateCardSpotsForOnePlayerCard (playercard_id) {
//     const query = {
//         text: 
//     }
// };
