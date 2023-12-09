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
      text: "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
      values: [username, email, password],
    };
  
    try {
      const result = await db.query(query);
      console.log("User created successfully");
    } catch (error) {
      console.error("Error creating user:", error);
    }
  }


  async function createMessage(playerName, messageContent, messageTime) {
    const query = {
        text: "INSERT INTO messages (player_name, message_content, message_time) VALUES ($1, $2, $3)",
        values: [playerName, messageContent, messageTime],
    };

    try {
        const result = await db.query(query);
        console.log("Message created successfully");
    } catch (error) {
        console.error("Error creating message:", error);
    }
}
  
module.exports = configureDatabase;

