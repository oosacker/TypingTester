let wordArray = []
let currentWord = ""
let maxTime = 30    // Game time defined by the player
let timeLimit = 0;  // Displayed countdown time
let gameRunning = false
let wordCount = 0
let inputWord = ""
let myTimer = 0
let userName = "Player"
let timeBlinking = 0
let msgBlinking = 0
let languageMode = "en"

function sendGameResult() {
    // Send game result to web server with XMLHttpRequest
    let xhr = new XMLHttpRequest();
    let url = "/game";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    let data = JSON.stringify({"userName": userName, "wordCount": wordCount, "maxTime": maxTime});
    xhr.send(data);
}

// Choose a random word from the word array (sent from the web server)
function chooseWord() {
    let random = Math.floor(Math.random() * wordArray.length)
    console.log(random)
    currentWord = wordArray[random]
    $("#word-output").text(currentWord)
}

// Ends the current game
function gameOver() {
    gameRunning = false

    $("#game_end").modal();  // Display the overlay dialogue

    clearInterval(myTimer)  // Stops setCountdownTimer
    clearInterval(timeBlinking) // Stops the blinking effect on the timer

    sendGameResult()    // Send the results to the server
    updateHighScore()   // Update the high score

    $("#word-input").prop("disabled", true);    // Disable keyboard input
    $("#word-input").val("")    // Reset the input area

    $("#message").css("color", "dimgray"); // Change the colour so it is obvious
    msgBlinking = setInterval(blinkMsg, 1000)

    $("#message").text("Click me to play again")    // Set the game will reset if you click the message box
}

function setCountdownTimer() {

    if (timeLimit === 0) {
        gameOver()
    }

    // Special case for time = 5 to start the blinking effect. Cannot set call setInterval more than once or cannot stop!!!!
    else if (timeLimit === 5) {
        timeBlinking = setInterval(blinkTime, 200);
        timeLimit -= 1
        $("#time").text(timeLimit)
    } else {
        timeLimit -= 1
        $("#time").text(timeLimit)
    }
}

// Requires non-lite version of jQuery to work!!! (Animations are not included in lite version)
function blinkTime() {
    $('#time').fadeOut(100);
    $('#time').fadeIn(100);
}

function blinkMsg() {
    $('#message').fadeOut(500);
    $('#message').fadeIn(500);
}

function updateHighScore() {
    // Send a fetch request via GET
    fetch('/get_highscore')
        .then(function (response) {
            // Parse response as JSON
            return response.json();
        })
        .then(function (json) {
            // console.log(json);
            // console.log("Fetched high score: " + json['high_score']);
            $("#highScore").text(json['high_score'])
        })
}

function resetGame() {
    gameRunning = false
    timeLimit = maxTime
    wordCount = 0

    chooseWord()
    clearInterval(msgBlinking)
    $("#message").css("color", "black"); // Change the colour back

    $("#message").text("Start typing to play")
    $("#time").text(timeLimit)
    $("#word-input").val("")
    $("#wordcnt").text(wordCount)
    $("#word-input").prop("disabled", false);
}

function GameStart() {
    gameRunning = true
    myTimer = setInterval(setCountdownTimer, 1000)
}

// Event handler for clicking the message area -- does nothing unless game over
$("#message").click(function () {
    if (!gameRunning) {
        resetGame()
    }
});

// Event handler for the name entry dialogue, but DO NOT change if the input box was empty (leaves as default 'player')
$("#name_save_btn").click(function () {
    let userName_temp = $("#name_input").val()
    if (userName_temp !== '')
        userName = userName_temp

    maxTime = parseInt($("#time_input").val())
    timeLimit = maxTime
    $("#time").text(timeLimit)


    $("#name_entry_box").modal('hide')  // Hide the dialogue
});

// Main game section
$(document).ready(function () {

    $("#name_entry_box").modal()  // Display the overlay dialogue

    wordArray = getWordList()
    // wordArray = getWordListX(languageMode)

    resetGame()
    updateHighScore()

    // Do not use keydown -- will not read first character!!
    $("#word-input").keyup(function () {

        $("#message").text("Playing...")
        inputWord = $("#word-input").val()

        console.log(inputWord)
        console.log(currentWord)

        if (gameRunning) {
            // Convert the strings to ignore case; use trim() to remove spaces before and after input
            if (inputWord.trim().toUpperCase() === currentWord.toUpperCase()) {
                $("#word-input").val("")    // Clear the input field
                chooseWord()
                wordCount++
                $("#wordcnt").text(wordCount)
            }
        } else {
            GameStart()
            $("#message").text("Playing...")
        }
    })
})