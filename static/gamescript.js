// Variables
let wordArray = []
let currentWord = ""
let timeLimit = 10
let gameRunning = false
let message = "my message"
let inputWord = ""

// Functions
function Init() {
    wordArray = [
        "apple", "banana", "orange", "pineapple", "grape", "cherry", "mango"
    ]
    $("#time").text(timeLimit)
    $("#message").text(message)
}

$(document).ready(function () {
    Init()
    let random = Math.floor(Math.random() * wordArray.length)
    console.log(random)
    currentWord = wordArray[random]
    $("#word-output").text(currentWord)
})


function setCountdownTimer(){
    $("#time").text(timeLimit-=1)
}

function GameStart(){
    gameRunning = true
    setInterval(setCountdownTimer, 1000)
}

$(document).ready(function (){
    // Do not use keydown -- will not read first character!!
    $("#word-input").keyup(function(){

        inputWord = $("#word-input").val()

        console.log(inputWord)
        console.log(currentWord)

        if(gameRunning) {
            if (inputWord === currentWord) {
                $("#message").text("You win")
            }
        }
        else {
            GameStart()
            $("#message").text("Playing game")
        }
    })
})