// UI Objects
var playernameInput = document.querySelector('.playernameInput');
var playerList = document.querySelector('.playerList')
var gamePlayerList = document.querySelector('playersView');

const loginPage = document.querySelector('login.page');
const lobbyPage = document.querySelector('lobby.page');
const gamePage = document.querySelector('game.page');
const newGameBtn = document.querySelector('#newGameBtn');
// const joinGameBtn = document.querySelector('#joinGameBtn');
const startGameBtn = document.querySelector('#startGameBtn');

// Variables
var socket = io();
var playername;
var currentInput = playernameInput.focus();
var gameState = {
    players: [],
    currentPlayer: [],
    market: [],
    table: [],
}

newGameBtn.addEventListener('click', () => {
    playername = playernameInput.value.trim();
    if (playername) {
        socket.emit('newGame', playername);
    }
});

startGameBtn.addEventListener('click', () => {
    socket.emit('startGame');
});

function updateLobbyPlayerList(playersData) {
    console.log(updateLobbyPlayerList.name);

    document.querySelectorAll("li.player").forEach(el => {
        el.remove();
    })
    playersData.players.forEach(player => {
        let el = document.createElement("li");
        el.classList.add('player');
        el.innerText = player;
        playerList.appendChild(el);
    });
}

function updateGamePlayerList(players) {
    console.log(updateGamePlayerList.name);
    document.querySelectorAll("playerCard").forEach(el => {
        el.remove();
    })
    players.forEach(player => {
        let el = document.createElement("playerCard")
        el.innerText = player;
        gamePlayerList.appendChild(el);
    })
}

function updateGameDispose(cards) {
    console.log(updateGameDispose.name);
    document.querySelectorAll("#DisposeCardPile .Card").forEach(el => {
        el.remove();
    })
    cards.forEach(card => {
        let el = document.createElement("div")
        el.classList.add("Card");
        el.draggable = true;
        el.innerText = card.shape + card.number;
        document.querySelector("#DisposeCardPile").appendChild(el);
    })
}

function updateGameMarket(cards) {
    console.log(updateGameMarket.name);
    document.querySelectorAll("#MarketCardPile .Card").forEach(el => {
        el.remove();
    })
    cards.forEach(card => {
        let el = document.createElement("div")
        el.classList.add("Card");
        el.draggable = true;
        el.innerText = card.shape + card.number;
        document.querySelector("#MarketCardPile").appendChild(el);
    })
}

function moveToLobby() {
    lobbyPage.style.display = "block";
    loginPage.style.display = "none";
}

function moveToGame() {
    gamePage.style.display = "block";
    lobbyPage.style.display = "none";
}

function updateGameState(gameState) {
    updateGamePlayerList(gameState.players);
    updateGameMarket(gameState.table.market);
    updateGameDispose(gameState.table.dispose);
    socket.emit("getHand");
    addEvents();
}

function addEvents() {
    // Card Drag and Drop
    var dragCards = document.querySelectorAll('.Card');
    var dragContainers = document.querySelectorAll('.CardContainer');


    dragCards.forEach(draggable => {
        draggable.addEventListener('dragstart', () => {
            console.log("Drag Start %s", draggable.innerHTML);
            setTimeout(() => draggable.classList.add('Dragging'), 0);
        });

        draggable.addEventListener('dragend', () => {
            console.log("Drag End %s", draggable.innerHTML);
            draggable.classList.remove('Dragging');
        })
    });

    dragContainers.forEach(container => {
        container.addEventListener('dragover', e => {
            e.preventDefault();
            container.classList.add('DragEnter');
        });

        container.addEventListener('dragleave', e => {
            e.preventDefault();
            container.classList.remove('DragEnter');
        });

        container.addEventListener('drop', e => {
            e.preventDefault();
            const draggable = document.querySelector('.Dragging');
            console.log("Appending to %s", container.id)
            container.appendChild(draggable);
            container.classList.remove('DragEnter');
        });
    });

}

// Socket Events
socket.on('login', (playersData) => {
    moveToLobby();
    updateLobbyPlayerList(playersData);
});

socket.on('playerJoined', (playersData) => {
    updateLobbyPlayerList(playersData);
});

socket.on('gameStarted', (gameState) => {
    moveToGame();
    updateGameState(gameState);
});

socket.on('renderHand', (hand) => {
    console.log(hand);
});
