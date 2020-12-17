// Setup basic express server
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
const {Whot} = require('./server/game.js');

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(path.join(__dirname, 'public')));


var gameState = {
  currentPlayer: [],
  players: [],
  table: {}
}

var gameObj = null;
let numPlayers = 0;
var players = [];
var gameStarted = false;

io.on('connection', (client) => {
  let addedPlayer = false;

  client.on('newGame', (playername) => {
    console.log('FUNC: Add player');

    if (addedPlayer) {
      console.log('WARN: Player Already Added');
      return;
    }

    // we store the playername in the socket session for this client
    client.username = playername;
    ++numPlayers;
    addedPlayer = true;

    console.log('Store Player: ' + client.username);
    // Add new player to the players list
    players.push(client.username);
    console.log('All Players: ' + players);
    client.emit('login', {players: players});

    // echo globally (all clients) a new playerList
    client.broadcast.emit('playerJoined', {players: players});
  });

  client.on('joinGame', (roomcode, playername) => {
    console.log("Add %s to Room %s", {playername, roomcode});
 
    // we store the playername in the socket session for this client
    client.username = playername;
    ++numPlayers;
    addedPlayer = true;

    console.log('Store Player: ' + client.username);
    // Add new player to the players list
    players.push(client.username);
    console.log('All Players: ' + players);
    client.emit('login', {players: players});

    // echo globally (all clients) a new playerList
    client.broadcast.emit('player joined', {players: players});
  });

  client.on('startGame', (roomCode) => {
    console.log("Start game");
    if (gameStarted) {
      return;
    }

    gameStarted = true;
    gameObj = new Whot(players);
    client.emit('gameStarted');
    client.broadcast.emit('gameStarted');
  });

  client.on('init-ui', () => {
    console.log("Send Hand to %s", client.username);
    gameState.currentPlayer = gameObj.currentPlayer;
    gameState.players = gameObj.players;
    gameState.table = gameObj.table;
    let pObj = gameObj.playerObjs.find(obj => obj.name === client.username);
    client.emit('update-player-state', {gameState: gameState, hand: pObj.hand});
  });

  client.on('play-pick', () => {
    gameObj.playerPick();
    gameObj.nextPlayer();

    gameState.currentPlayer = gameObj.currentPlayer;
    gameState.players = gameObj.players;
    gameState.table = gameObj.table;

    let pObj = gameObj.playerObjs.find(obj => obj.name === client.username);
    client.emit('update-player-state', {gameState: gameState, hand: pObj.hand});
    client.broadcast.emit('update-game-state', gameState);
  });

  client.on('play-confirm', (selectedIndex) => {
    gameObj.playerPlay(selectedIndex);
    gameObj.nextPlayer();

    gameState.currentPlayer = gameObj.currentPlayer;
    gameState.players = gameObj.players;
    gameState.table = gameObj.table;

    let pObj = gameObj.playerObjs.find(obj => obj.name === client.username);
    client.emit('update-player-state', {gameState: gameState, hand: pObj.hand});
    client.broadcast.emit('update-game-state', gameState);
  });
});
