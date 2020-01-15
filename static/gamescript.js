let InputArray = []
let wordArray = []
let currentWord = ""
const maxTime = 5
let timeLimit = maxTime
let gameRunning = false
let wordCount = 0
let inputWord = ""
let myTimer = 0
let userName = "player"
let highSCore = 0

function sendGameResult() {
    // Send game result to web server with XMLHttpRequest
    let xhr = new XMLHttpRequest();
    let url = "/game";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    let data = JSON.stringify({"userName": userName, "wordCount": wordCount, "maxTime": maxTime});
    xhr.send(data);
}

function chooseWord() {
    let random = Math.floor(Math.random() * wordArray.length)
    console.log(random)
    currentWord = wordArray[random]
    $("#word-output").text(currentWord)
}

function gameOver() {
    clearInterval(myTimer)  // Stops setCountdownTimer
    sendGameResult()    // Send the results to the server
    updateHighScore()

    $("#word-input").prop("disabled", true);    // Disable keyboard input
    $("#word-input").val("")
    $("#game_end").modal();  // Display the overlay dialogue
    gameRunning = false
    $("#message").css("color", "grey"); // Change the colour so it is obvious
    $("#message").text("Click me to play again")    // Set the game will reset if you click the message box
}

function setCountdownTimer() {
    if (timeLimit === 0) {
        gameOver()
    } else {
        timeLimit -= 1
        $("#time").text(timeLimit)
    }
}

function updateHighScore(){
        // Send a fetch request
    fetch('/get_highscore')
        .then(function (response) {
            return response.json(); // But parse it as JSON this time
        })
        .then(function (json) {
            //console.log('GET response as JSON:');
            console.log(json); // Here’s our JSON object
            console.log("fetched high score " + json['high_score']);
            $("#highScore").text(json['high_score'])
        })
}

function resetGame() {
    gameRunning = false
    timeLimit = maxTime
    wordCount = 0
    chooseWord()

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
        $("#message").css("color", "black"); // Change the colour back
    }
});

// Main game section
$(document).ready(function () {

    $("#name_entry").modal();  // Display the overlay dialogue

    $("#time").text(timeLimit)
    wordArray = getWordList()
    resetGame()
    updateHighScore()

    // Do not use keydown -- will not read first character!!
    $("#word-input").keyup(function () {

        $("#message").text("Playing")
        inputWord = $("#word-input").val()

        console.log(inputWord)
        console.log(currentWord)

        if (gameRunning) {
            if (inputWord === currentWord) {
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