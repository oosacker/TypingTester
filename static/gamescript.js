// Variables
let wordArray = []
let currentWord = ""
let timeLimit = 0
let gameRunning = false

// Functions
function Init() {
    wordArray = [
        "apple", "banana", "orange", "pineapple", "grape", "cherry", "mango"
    ]
    timeLimit = 60 * 1000
    $("#time").text(timeLimit/1000)
}

function GameStart(){
    console.time("timer")
    gameRunning = true

    while($("#word-input").text() != currentWord){

    }

}

$(document).ready(function () {
    Init()
    currentWord = wordArray[Math.ceil(Math.random() * wordArray.length)]
    $("#word-output").text(currentWord)
})

$(document).ready(function (){
    $("#word-input").keypress(function(){
        GameStart()
    })
})