const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const configureDatabase = require("../../db/db");


router.get("/", (_request, response) => {
    const user = _request.session.user;
    response.render("sign_up.ejs", { pageTitle: "Home", pageContent: "Welcome", loggedIn: _request.session.loggedIn, user});
});

router.post("/",async (request,response) =>  {
    const { username, email, password, confirm_password} = request.body;

    const db = configureDatabase();
    await db.connect();
    
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
