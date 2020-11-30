module.exports (
    Whot
)


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

    get size() {
        this.cards.length;
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

class Whot {
    CARD_PER_PERSON = 6;

    constructor(players) {
        this.playerObjs = [];
        this.table = [];

        this.players = players;
        this.initDeck(players.length);

        this.players.forEach((playername) => {
            let p = new Player(playername);
            for (let i = 0; i < this.CARD_PER_PERSON; i++) {
                p.hand.push(this.deck.cards.pop());
            }
            this.playerObjs.push(p);
        });

        this.table.push(this.deck.cards.pop());
    }

    initDeck(numPlayers) {
        let numDecks = Math.floor(numPlayers / 9 + 1);
        this.deck = new Deck(numDecks);
        this.deck.shuffle();
    }
}
