
//scripts.js

let value=50;//global variable

const deck = document.querySelectorAll(".memCard");
let prevCard = null;
let flips = 0;
const disasterDeck = [];

//for move counter
let moves = 0;
let counter = document.querySelector(".moves");
let blocked = false; // If false, user can flip. If true, user is locked out from playing
randomize();

//initialize timer
var sec = 0, min = 0;
var finalTime;
document.getElementById("timer").innerHTML = "0:00";

//initialize disaster counter
let disasterCount = 0;
document.getElementById("disasters").innerHTML = "" + disasterCount;

//count matches
var matches = 0;
let gameover = false;

// associate reset() with html button id="reset"
document.getElementById("reset").onclick = reset;

function flipCard()
{
    if(blocked)return;

    //timer start on first move
    if (moves === 0){
        startTimer();
    }
    moves++;
    //end of timer
    flips += 1;
    this.classList.toggle('flip');

    // If this card is a disaster add it to the disaster list and increase disaster count
    if (this.dataset.name   === "fire" ){
        this.classList.toggle('flip');
        this.classList.toggle('flip');
        disasterDeck.push(this.dataset.name);
        console.log(disasterDeck);
        this.removeEventListener('click', flipCard);
        disasterCount ++;
        disasterCounter(disasterCount);

    }

    if (disasterDeck.length > 0 && this.dataset.name   === "water" && flips === 1){
        let i;
        for (i = 0; i < disasterDeck.length; i++){
            if (disasterDeck[i] === 'fire'){
                this.classList.toggle('flip');
                this.removeEventListener('click', flipCard);
                disasterCount --;
                disasterCounter(disasterCount);
                disasterDeck.pop();
                console.log(disasterDeck);
                matches++;
                flips = 2;
                if (matches === 6){
                    console.log('Victory')
                    gameover = true;
                    finalTime = document.getElementById("timer").innerHTML;
                    victory(finalTime);
                    //document.getElementById("finTime").innerHTML = finalTime;
                }
            }
        }
    }

    if (disasterCount > 1){
        console.log('Defeat')
        gameover = true;
        defeat(disasterCount);
    }

    // If this is not the first click
    if(prevCard != null)
    {   // If the this card and the previous card share the same name remove the event
        // listener functionality, disabling the card face up.
        if(this.dataset.name === prevCard.dataset.name && prevCard != this)
        {
            this.removeEventListener('click', flipCard);
            prevCard.removeEventListener('click', flipCard);
            console.log("removed listeners");
            matches++;
            prevCard = null
            flips = 0;


            //IF ALL MATCHED
            if (matches === 6){
                console.log('Victory')
                gameover = true;
                finalTime = document.getElementById("timer").innerHTML;
                victory(finalTime);
                //document.getElementById("finTime").innerHTML = finalTime;
            }

        }
    }

    console.log(flips);
    // If you flipped two cards with no match, then flip them back down.
    if(flips >= 2)
    {
        blocked = true;
        // Without this delay, last card "flipped" flips back too fast to
        // be seen.
        if(prevCard != this)
        {
            setTimeout(() =>{
                if (this.dataset.name   != "fire" ){
                    this.classList.toggle('flip');
                }
                if(prevCard.dataset.name != "fire"){
                    prevCard.classList.toggle('flip');
                }
                prevCard = null;
                blocked = false;
            }, 1500);
        }
        setTimeout(()=>{
            blocked = false;
            flips = 0;
            prevCard = null;
        }, 1500);

    }
    else {prevCard = this}
}

// Shuffle the board
function randomize()
{
    deck.forEach(c => {
        let ranPos = Math.floor(Math.random() * 12);
        c.style.order = ranPos;
    })
}

// Add eventListener events to every card during initialization, and call flipCard() when clicked.
deck.forEach(c =>c.addEventListener('click', flipCard));

//Count the Players moves
function moveCounter(){
    moves++;
    counter.innerHTML = moves;
    //start timer on first click
    if(moves == 1){
        sec = 0;
        min = 0;
        startTimer(); //insert timer here
    }
}

//Counts the Number of disasters
function disasterCounter(disasterCount) {
    document.getElementById("disasters").innerHTML = "" + disasterCount;

}

function getUsername() {
    // Once the user accepts the username save it in the file
    const storage = require('electron-json-storage');

    storage.keys(function(error, keys) {
        if (error) throw error;

        for (let key of keys) {
            //console.log('There is a key called: ' + key);
            storage.get(key, function(error, data) {
                if (error) throw error;

                //console.log(data);
                if(data.score == null){
                    document.getElementById("nameplace").innerHTML = key;
                }
            });
        }
    });
}


//timer
function startTimer()
{
    var Countup = setInterval(function(){
        ++sec;
        //document.getElementById("matches").innerHTML = "matches: "+matches;
        document.getElementById("timer").innerHTML = ""+min+" : "+sec;
        //if all cards match
        if (sec == 59){
            min++;
            sec = -1;
        }
        if (gameover == true){
            document.getElementById("timer").innerHTML = finalTime;
        }
    },1000)
}

// resets the game board
function reset() {
    //if (flips > 0) return; // doesn't quite fix a mid-flip reset

    // block while reseting
    blocked = true;
    flips = 0;
    prevCard = null;
    blocked = false;

    // flips all cards facedown
    deck.forEach(c => c.classList.toggle('flip', false));

    // reapply event listener to disabled (or all) cards
    deck.forEach(c => c.addEventListener('click', flipCard));

    // randomize again, but delayed so that cards can flip first
    setTimeout(randomize, 500);

    blocked = false;

    //restart time and moves
    moves = 0;
    sec = 0;
    min = 0;
    //document.getElementById("timer").innerHTML = "time: 0 min 0 sec";
    clearInterval(Countup);
}

function victory(finalTime) {

    const remote = require('electron').remote;
    const { BrowserWindow } = require('electron').remote

    let win = new BrowserWindow({ width: 800, height: 600, modal:true,  webPreferences:{nodeIntegration:true} })
    win.loadURL("file://" + __dirname + '/Victory.html?user=' + finalTime )
    //let newWin = window.open("Victory.html?user=" + finalTime , "Victory", "width=400,height=400");


}

function defeat(disasterCount) {
    let newWin = window.open("defeat.html", "Defeat", "width=400,height=400");
    newWin.document.getElementById("disastercount").innerHTML = '5';

}

function loadleaderboard() {
    const remote = require('electron').remote;
    const { BrowserWindow } = require('electron').remote

    let win = new BrowserWindow({ width: 800, height: 600, modal:true,  webPreferences:{nodeIntegration:true} })
    win.loadURL("file://" + __dirname + '/leaderboard.html')

}

function mainmenu() {
    const remote = require('electron').remote;
    const { BrowserWindow } = require('electron').remote

    let win = new BrowserWindow({ width: 800, height: 600, modal:true })
    win.loadURL("file://" + __dirname + '/prefs.html')

}





