class Card {
    constructor(shape, number) {
        this.shape = shape;
        this.number = number;
    }
}

class Deck {
    Shapes = {
        CIRCLE: "CIRCLE",
        TRIANGLE: "TRIANGLE",
        CROSS: "CROSS",
        SQUARE: "SQUARE",
        STAR: "STAR",
        WHOT: "WHOT",
    };

    circles = [1, 2, 3, 4, 5, , 7, 8, , 10, 11, 12, 13, 14];
    triangles = [1, 2, 3, 4, 5, , 7, 8, , 10, 11, 12, 13, 14];
    crosses = [1, 2, 3, , 5, , 7, , , 10, 11, , 13, 14];
    squares = [1, 2, 3, , 5, , 7, , , 10, 11, , 13, 14];
    stars = [1, 2, 3, 4, 5, , 7, 8, , , , , ,];
    whot = [20, 20, 20, 20]

    constructor(numDecks) {
        this.cards = [];
        for (let i = 0; i < numDecks; i++) {
            this.circles.forEach(number => this.cards.push(new Card(this.Shapes.CIRCLE, number)));
            this.triangles.forEach(number => this.cards.push(new Card(this.Shapes.TRIANGLE, number)));
            this.crosses.forEach(number => this.cards.push(new Card(this.Shapes.CROSS, number)));
            this.squares.forEach(number => this.cards.push(new Card(this.Shapes.SQUARE, number)));
            this.stars.forEach(number => this.cards.push(new Card(this.Shapes.STAR, number)));
            this.whot.forEach(number => this.cards.push(new Card(this.Shapes.WHOT, number)));
        }
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }
}

class Player {
    constructor(name) {
        this.name = name
        this.hand = []
    }
}

exports.Whot = class {
    CARD_PER_PERSON = 6;
    playerObjs = [];
    players = [];
    table = { market: [], dispose: [] };
    cardDeck = [];

    constructor(players) {
        this.players = players
        this.shufflePlayers();
        this.initDeck(this.players.length);

        this.players.forEach((playername) => {
            let p = new Player(playername);
            for (let i = 0; i < this.CARD_PER_PERSON; i++) {
                p.hand.push(this.cardDeck.cards.pop());
            }
            this.playerObjs.push(p);
        });

        this.table.dispose.push(this.cardDeck.cards.pop());
        this.table.market = [... this.cardDeck.cards];

        this.playerIndex = 0
        this.currentPlayer = this.players[this.playerIndex];
    }

    initDeck(numPlayers) {
        let numDecks = Math.floor(numPlayers / 9 + 1);
        this.cardDeck = new Deck(numDecks);
        this.cardDeck.shuffle();
    }

    getMarket() {
        return this.table.market.pop()
    }

    disposeCard(card) {
        return this.table.dispose.push(card)
    }

    shufflePlayers() {
        for (let i = this.players.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.players[i], this.players[j]] = [this.players[j], this.players[i]];
        }
    }

    playerPlay(cardIndex) {
        let playerObj = this.playerObjs.find(obj => obj.name === this.currentPlayer)
        let card = playerObj.hand.splice(cardIndex, 1)[0]
        this.disposeCard(card);
        // Validate Play
        playerObj.hand.push(this.getMarket());
        return `Player ${playerObj.name} played ${card.shape}.${card.number}`;
    }

    playerPick() {
        let playerObj = this.playerObjs.find(obj => obj.name === this.currentPlayer)
        let card = this.getMarket();
        playerObj.hand.push(card);
        return `Player ${playerObj.name} picked ${card.shape}.${card.number}`;
    }

    nextPlayer() {
        this.playerIndex = this.playerIndex++ >= this.players.length-1 ? 0 : this.playerIndex++; 
        this.currentPlayer = this.players[this.playerIndex];
        return `Next Player: ${this.currentPlayer}`
    }

    dbg() {
        console.log({currentPlayer: this.currentPlayer});
        console.log(this.playerObjs[0]);
        console.table(this.table.dispose);
        let s = this.table.market.length-3;
        console.table(this.table.market.slice(s,s+3));
    }
}


