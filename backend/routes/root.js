const express = require("express");
const router = express.Router();

router.get("/hello", (_request, response) => {
    response.render("hello"); 
}); // this is how you call a route to like localhost:x/hello will be this template page

// so the response.render("blah") -> where blah is what page you want to render in views
module.exports = router;
