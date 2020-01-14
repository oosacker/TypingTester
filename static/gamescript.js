let InputArray = []
let wordArray = []
let currentWord = ""
const maxTime = 20
let timeLimit = maxTime
let gameRunning = false
let wordCount = 0
let inputWord = ""
let myTimer = 0
let userName = "player"

// function getWordList() {
//     // Get the list of strings from the python web server encoded in JSON format
//     InputArray = JSON.parse('{{ myWords | safe }}');    // Do not use " --- MUST use ' !!!!!
//
//     // Because InputArray is 2d (normally JSON has a key-value pair; if you don't define the key it's 0)
//     wordArray = InputArray[0]
// }

function sendGameResult() {
    // Creating a XHR object
    let xhr = new XMLHttpRequest();
    let url = "/game";

    // open a connection
    xhr.open("POST", url, true);

    // Set the request header i.e. which type of content you are sending
    xhr.setRequestHeader("Content-Type", "application/json");

    // Converting JSON data to string
    let data = JSON.stringify({"userName": userName, "wordCount": wordCount, "maxTime": maxTime});

    // Sending data with the request
    xhr.send(data);
}

$("#message").click(function () {
    if (!gameRunning) {
        resetGame()
        $("#message").css("color", "black"); // Change the colour back
    }
});

function chooseWord() {
    let random = Math.floor(Math.random() * wordArray.length)
    console.log(random)
    currentWord = wordArray[random]
    $("#word-output").text(currentWord)
}

function gameOver() {
    clearInterval(myTimer)
    sendGameResult()    // Send the results to the server

    $("#word-input").prop("disabled", true);    // Disable keyboard input
    $("#word-input").val("")
    $("#myModal").modal();  // Display the overlay dialogue
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

function resetGame() {
    gameRunning = false
    timeLimit = maxTime
    wordCount = 0
    chooseWord()

    $("#message").text("Game set")
    $("#time").text(timeLimit)
    $("#word-input").val("")
    $("#wordcnt").text(wordCount)
    $("#word-input").prop("disabled", false);
}

function GameStart() {
    gameRunning = true
    myTimer = setInterval(setCountdownTimer, 1000)
}

$(document).ready(function () {

    $("#time").text(timeLimit)
    wordArray = getWordList()
    resetGame()

    // Do not use keydown -- will not read first character!!
    $("#word-input").keyup(function () {

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