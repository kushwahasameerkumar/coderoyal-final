const express = require("express");
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

const path = require("path");
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');

require('dotenv').config();
const port = process.env.PORT || 3000;

const db = require(path.resolve('includes', 'db.js'));

//import route controllers
const apiRouter = require(path.resolve('controller', 'api.js'));

//connect to database
new db()._connect();

// Compiler utils
// const Compiler = require("./includes/compiler.js");

// const content = `/******************************************************************************

//     Online C++ Compiler.
// Code, Compile, Run and Debug C++ program online.
// Write your code in this editor and press "Run" button to compile and execute it.

// *******************************************************************************/

// #include <iostream>
    
// using namespace std;

// int main()
// {
// string a = "sameer";
// cout<<a;

// return 0;
// }
// `;

/**
 * socket.io handler
 */
const { socketAuth } = require(path.resolve('middleware', 'auth.js'));
const { getMatchPlayers, insertMatchPlayer, removeMatchPlayer } = require(path.resolve('includes', 'db_functions.js'));

io.use(socketAuth).on("connection", async socket => {
    //todo: check all inputs for null value
    socket.match = { id: socket.handshake.query.match_id };
    console.log("A client connected.", socket.auth.username, socket.match.id);

    //join room with name: match_id
    socket.join(socket.match.id);

    //emit a player has joined
    await insertMatchPlayer(socket.match.id, socket.auth._id);
    const matchPlayers = await getMatchPlayers(socket.match.id);
    io.to(socket.handshake.query.match_id).emit("player_joined", matchPlayers);

    //emit a player has left
    socket.on("disconnect", async() => {
        await removeMatchPlayer(socket.match.id, socket.auth._id);
        const matchPlayers = await getMatchPlayers(socket.match.id);
        io.to(socket.match.id).emit('player_left', matchPlayers);
    });
});


//parse application/json request body
app.use(bodyParser.json());

//api end-point handler
app.use("/api", apiRouter);


app.get("/", (req, res) => {
    res.send("Hello from server");
})


server.listen(port, () => {
    console.log("Server is up and running...");
})