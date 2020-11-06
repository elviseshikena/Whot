$(function () {
    // Initialize variables
    var $window = $(window);
    var $playernameInput = $('.usernameInput'); // Input for username
    var $playerList = $('.playerList')

    var $loginPage = $('.login.page'); // The login page

    // Prompt for setting a username
    var playername;
    var $currentInput = $playernameInput.focus();

    var socket = io();

    // Prevents input from having injected markup
    const cleanInput = (input) => {
        return $('<div/>').text(input).html();
    }

    // Sets the client's username
    const setPlayername = () => {
        playername = cleanInput($playernameInput.val().trim());

        // If the playername is valid
        if (playername) {
            // Tell the server this player
            socket.emit('add player', playername);
        }
    }

    // Log a message
    const addToPlayerList = (data) => {
        var $el = $('<li>').addClass('log').text(data.playername);
        $playerList.append($el);
    }

    // Keyboard events

    $window.keydown(event => {
        // Auto-focus the current input when a key is typed
        if (!(event.ctrlKey || event.metaKey || event.altKey)) {
            $currentInput.focus();
        }
        // When the client hits ENTER on their keyboard
        if (event.which === 13) {
            setPlayername();
        }
    });

    // Click events

    // Focus input when clicking anywhere on login page
    $loginPage.click(() => {
        $currentInput.focus();
    });

    // Socket events

    // Whenever the server emits 'player joined', log it in the chat body
    socket.on('player joined', (data) => {
        console.log(data);
        // addToPlayerList(data);
    });
});