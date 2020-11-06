// Setup basic express server
var express = require('express');
var app = express();
var path = require('path');
const { Interface } = require('readline');
const { prototype } = require('stream');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(path.join(__dirname, 'public')));

// Game room
var numPlayers = 0;

io.on('connection', (socket) => {
  var addedPlayer = false;

  // when the client emits 'add player', this listens and executes
  socket.on('add player', (playername) => {
    console.log('add player');

    if (addedPlayer) return;

    console.log('Store playername: ' + playername);
    // we store the playername in the socket session for this client
    socket.username = playername;
    ++numPlayers;
    addedPlayer = true;

    console.log('Broadcast: ' + socket.username);
    // echo globally (all clients) that a person has joined
    socket.broadcast.emit('player joined', {
      playername: socket.username,
      numPlayers: numPlayers
    });
  });
});





class Card {
  constructor(shape, number) {
    this.shape = shape;
    this.number = number;
  }
}


class Deck {
  circles =   [1,2,3,4,5, ,7,8, ,10,11,12,13,14];
  triangles = [1,2,3,4,5, ,7,8, ,10,11,12,13,14];
  crosses =   [1,2,3, ,5, ,7, , ,10,11,  ,13,14];
  squares =   [1,2,3, ,5, ,7, , ,10,11,  ,13,14];
  stars =     [1,2,3,4,5, ,7,8, ,  ,  ,  ,  ,  ];
  whot =      [20,20,20,20]

  constructor() {
    this.cards = [];
    this.circles.forEach(number => this.cards.push(new Card("CIRCLE", number)));
    this.triangles.forEach(number => this.cards.push(new Card("TRIANGLE", number)));
    this.crosses.forEach(number => this.cards.push(new Card("CROSS", number)));
    this.squares.forEach(number => this.cards.push(new Card("SQUARE", number)));
    this.stars.forEach(number => this.cards.push(new Card("STAR", number)));
    this.whot.forEach(number => this.cards.push(new Card("WHOT", number)));
  }

  get size() {
    this.cards.length;
  }

  shuffle() {
    for(let i = this.cards.length-1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i+1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }
}

class Jackpot {
  constructor(players) {
    this.deck = new Deck();
    this.players = players;
  }

  createTeams() {
    
  }


}


