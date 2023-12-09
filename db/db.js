const { Client } = require("pg");

const configureDatabase = () => {
    const db = new Client({
        connectionString: process.env.DB_INTERNAL_URL,
        ssl:true
    });

    return db;
};

async function createUser(username, email, password) {
    const query = {
      text: "INSERT INTO player (username, email, password) VALUES ($1, $2, $3)",
      values: [username, email, password],
    };
  
    try {
      const result = await db.query(query);
      console.log("User created successfully");
    } catch (error) {
      console.error("Error creating user:", error);
    }
  }
  
module.exports = configureDatabase;

