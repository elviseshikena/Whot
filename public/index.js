$(function () {
    // Initialize variables
    var $window = $(window);
    var $playernameInput = $('.playernameInput');
    var $playerList = $('.playerList')

    var $loginPage = $('login.page');
    var $lobbyPage = $('lobby.page');
    // const $gamePage = $('game.page');
    var $newGameBtn = $('#newGameBtn');
    var $joinGameBtn = $('#joinGameBtn');

    
    
    // Prompt for setting a username
    var playername;
    var $currentInput = $playernameInput.focus();
    
    var socket = io();

    // Prevents input from having injected markup
    const cleanInput = (input) => {
        return $('<div/>').text(input).html();
    }
    
    const newGame = () => {
        playername = cleanInput($playernameInput.val().trim());
        if (playername) {
            $loginPage.fadeOut();
            $lobbyPage.show();
            socket.emit('newGame', playername);
        }
    }

    const joinGame = () => {
        playername = cleanInput($playernameInput.val().trim());
        var code = prompt("Room Code");
        if (code) {
            $loginPage.fadeOut();
            $lobbyPage.show();
            socket.emit('joinGame', {code, playername});
        }
    }

    $newGameBtn.click(newGame);
    $joinGameBtn.click(joinGame);

    // Log a message
    const updatePlayerList = (data) => {
        console.log("Update Player List");

        $(".player").remove();
        data.players.forEach(player => {
            var $el = $('<li>').addClass('player').text(player);
            $playerList.append($el);
        });
    }

    const moveToLobby = () => {
        $loginPage.fadeOut();
    }

    // Keyboard events

    $window.keydown(event => {
        // Auto-focus the current input when a key is typed
        if (!(event.ctrlKey || event.metaKey || event.altKey)) {
            $currentInput.focus();
        }
    });

    // Click events

    // Focus input when clicking anywhere on login page
    $loginPage.click(() => {
        $currentInput.focus();
    });

    // Socket events

    socket.on('login', (playersData) => {
        // Remove Question
        moveToLobby();
        updatePlayerList(playersData);
    });

    // Whenever the server emits 'player joined', log it in the chat body
    socket.on('player joined', (playersData) => {
        updatePlayerList(playersData);
    });
});