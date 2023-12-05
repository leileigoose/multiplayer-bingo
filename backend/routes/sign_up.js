const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const configureDatabase = require("../../db/db");


router.get("/", (_request, response) => {
    response.render("sign_up.ejs");
});

router.post("/",async (request,response) =>  {
    console.log("Request body:", request.body); // Add this line
    const { username, email, password, confirm_password} = request.body;

    const db = configureDatabase();
    await db.connect();
    console.log(password);
    console.log(username);
    console.log(email);
    try {
        const user = { username, email, password };

        await createUser(db, user);

        response.redirect("/login");
    } catch (error) {
        console.error("Error creating user:", error);
        response.status(500).send("Internal server error.");
    } finally {
        db.end(); 
    }
});
module.exports = router;


async function createUser(db, user) {
    console.log("User values:", user.username, user.email, user.password);
    const query = {
        text: "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
        values: [user.username, user.email, user.password],
    };

    const result = await db.query(query);
    console.log("User created successfully");
}
