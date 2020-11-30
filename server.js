// Setup basic express server
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
const { Whot } = require('./server/game');

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(path.join(__dirname, 'public')));


const gameState = {
  players: [],
  currentPlayer: [],
  market: [],
  table: [],
}


var gameObj = null;
let numPlayers = 0;
var players = [];
var gameStarted = false;

io.on('connection', (socket) => {
  let addedPlayer = false;

  socket.on('newGame', (playername) => {
    console.log('FUNC: Add player');

    if (addedPlayer) {
      console.log('WARN: Player Already Added');
      return;
    }
    if (numPlayers >= Whot.MAX_PLAYERS) {
      console.log('Max Players added');
      return;
    }

    // we store the playername in the socket session for this client
    socket.username = playername;
    ++numPlayers;
    addedPlayer = true;

    console.log('Store Player: ' + socket.username);
    // Add new player to the players list
    players.push(socket.username);
    console.log('All Players: ' + players);
    socket.emit('login', {players: players});

    // echo globally (all clients) a new playerList
    socket.broadcast.emit('player joined', {players: players});
  });

  socket.on('joinGame', (roomcode, playername) => {
    console.log("Add %s to Room %s", {playername, roomcode});
 
    // we store the playername in the socket session for this client
    socket.username = playername;
    ++numPlayers;
    addedPlayer = true;

    console.log('Store Player: ' + socket.username);
    // Add new player to the players list
    players.push(socket.username);
    console.log('All Players: ' + players);
    socket.emit('login', {players: players});

    // echo globally (all clients) a new playerList
    socket.broadcast.emit('player joined', {players: players});
  });

  socket.on('startGame', (roomCode) => {
    if (gameStarted) {
      return;
    }

    gameStarted = true;
    gameObj = new Whot(players);
    gameState.players = gameObj.players;
    gameState.market = gameObj.deck.cards;
    gameState.table = gameObj.table;
    gameState.currentPlayer = gameObj.currentPlayer;
    socket.broadcast.emit('updateGame', gameState);
  });

  socket.on('getHand', (playername) => {
    // Give PLayer his hand
  })
});


function startGame() {
  game = Whot()
}

