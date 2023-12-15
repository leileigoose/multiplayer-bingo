### Bingo!
# CSC 667 Fall 2023, Group A: Adithya Gutala, Louis Houston, Aleia Natividad, Nina Young

### CURRENT NODE PACKAGES INSTALLED 
├── body-parser@1.20.2

├── dotenv@16.3.1

├── ejs@3.1.9

├── express@4.18.2

├── http-errors@2.0.0

├── nodemon@3.0.1

└── pg@8.11.3

To start using, first make sure you have access to the team-bingo DB with psql. You will also need to make a .env file with the correct link.
Use ```npm install``` to install all necessary dependencies. You may need to uninstall and reinstall bcrypt before running as different machines seem to cause issues with this program.

## Overview
Our Bingo game is set up to allow you to make an account, log in, and view your active games and global games. Players can create a new room, generate a player card, and watch the bingo game play out automatically. When a player wins, their victory is announced in the global lobby. Players can chat with each other in the global lobby as well as individual game rooms.

# Structure
Our code has a standard backend and frontend, and the actual game logic is mostly stored in the .ejs files in views. All our Javascript files are found in the routes folder. All css is stored in a single static .css folder in frontend.