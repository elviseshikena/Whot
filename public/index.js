// UI Objects


// Card Drag and Drop
const dragCards = document.querySelectorAll('.Card');
const dragContainers = document.querySelectorAll('.CardContainer');

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
})

// Socket Events
// / $(function () {
//     // Initialize variables
//     var $window = $(window);
//     var $playernameInput = $('.playernameInput');
//     var $playerList = $('.playerList')

//     var $loginPage = $('login.page');
//     var $lobbyPage = $('lobby.page');
//     // const $gamePage = $('game.page');
//     var $newGameBtn = $('#newGameBtn');
//     var $joinGameBtn = $('#joinGameBtn');

    
    
//     // Prompt for setting a username
//     var playername;
//     var $currentInput = $playernameInput.focus();
    
//     var socket = io();

//     // Prevents input from having injected markup
//     const cleanInput = (input) => {
//         return $('<div/>').text(input).html();
//     }
    
//     const newGame = () => {
//         playername = cleanInput($playernameInput.val().trim());
//         if (playername) {
//             $loginPage.fadeOut();
//             $lobbyPage.show();
//             socket.emit('newGame', playername);
//         }
//     }

//     const joinGame = () => {
//         playername = cleanInput($playernameInput.val().trim());
//         var code = prompt("Room Code");
//         if (code) {
//             $loginPage.fadeOut();
//             $lobbyPage.show();
//             socket.emit('joinGame', {code, playername});
//         }
//     }

//     $newGameBtn.click(newGame);
//     $joinGameBtn.click(joinGame);

//     // Log a message
//     const updatePlayerList = (data) => {
//         console.log("Update Player List");

//         $(".player").remove();
//         data.players.forEach(player => {
//             var $el = $('<li>').addClass('player').text(player);
//             $playerList.append($el);
//         });
//     }

//     const moveToLobby = () => {
//         $loginPage.fadeOut();
//     }

//     // Keyboard events

//     $window.keydown(event => {
//         // Auto-focus the current input when a key is typed
//         if (!(event.ctrlKey || event.metaKey || event.altKey)) {
//             $currentInput.focus();
//         }
//     });

//     // Click events

//     // Focus input when clicking anywhere on login page
//     $loginPage.click(() => {
//         $currentInput.focus();
//     });

//     // Socket events

//     socket.on('login', (playersData) => {
//         // Remove Question
//         moveToLobby();
//         updatePlayerList(playersData);
//     });

//     // Whenever the server emits 'player joined', log it in the chat body
//     socket.on('player joined', (playersData) => {
//         updatePlayerList(playersData);
//     });
// });