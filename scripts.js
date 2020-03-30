
//scripts.js

// Sound constructor
/*
Attribution licenses:
https://creativecommons.org/licenses/by/3.0/
flipCard sound obtained from:
https://freesound.org/people/f4ngy/sounds/240776/
let value=50;//global variable

fireHazard sound obtained from:
https://freesound.org/people/InspectorJ/sounds/484266/
*/

function sound(src)
{
   this.sound = document.createElement("audio");
   this.sound.src = src;
   this.sound.setAttribute("preload", "auto");
   this.sound.setAttribute("controls", "none");
   this.sound.style.display = "none";
   document.body.appendChild(this.sound);
   this.play = function(){
       this.sound.play();
   }
   this.stop = function(){
       this.sound.pause();
   }
}

sFlipCard = new sound("flip_card.wav");
sFireHazard = new sound("fireHazard.wav");
sNameGenerate = new sound("nameGenerate.wav");
sResetGame = new sound("resetGame.wav");


var deck = document.querySelectorAll(".memCard");
let winCondition = 0; 
deck = randomize(deck);
let prevCard = null;
let flips = 0;
const disasterDeck = [];

//for move counter
let moves = 0;
let counter = document.querySelector(".moves");
let blocked = false; // If false, user can flip. If true, user is locked out from playing
//randomize();

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
    console.log(winCondition);
    if(blocked)return;

    //timer start on first move
    if (moves === 1){
        startTimer();
    }
    moves++;
    //end of timer
    flips += 1;
    fixFlipped = 0;
    this.classList.toggle('flip');

    // If this card is a disaster add it to the disaster list and increase disaster count
    if (this.dataset.name   === "fire" ){
        sFireHazard.play();
        this.classList.toggle('flip');
        this.classList.toggle('flip');
        disasterDeck.push(this.dataset.name);
        console.log(disasterDeck);
        this.removeEventListener('click', flipCard);
        disasterCount ++;
        disasterCounter(disasterCount);

    }


    /* 
    
    
    
    */
    if (disasterDeck.length > 0 && this.dataset.name  === "water"){
        let i;
        console.log("We are flipping water")
        fixFlipped = 0;
        for (i = 0; i < disasterDeck.length; i++){
            if (disasterDeck[i] === 'fire'){
                this.removeEventListener('click', flipCard);
                disasterCount--;
                disasterCounter(disasterCount);
                disasterDeck.pop();
                flips = 2;
                fixFlipped = 1;
            }
        }
        console.log("endof waterflip ");
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
            if (matches === winCondition){
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
                if (this.dataset.name   != "fire"  && fixFlipped === 0){
                    this.classList.toggle('flip');
                }
                if(prevCard != null)
                {
                   if(prevCard.dataset.name != "fire")
                    {
                        prevCard.classList.toggle('flip');
                    }  
                }
                prevCard = null;
                blocked = false;
            }, 1000);
        }
        setTimeout(()=>{
            blocked = false;
            flips = 0;
            prevCard = null;
        }, 1000);

    }
    else {prevCard = this}
}

// Shuffle the board
function randomize(deck)
{
    let elems = [];
    elems = deck;
    console.log(elems);
    let w = "calc(15% - 10px)"; // Size of card width 25-10px
    let h = "calc(15% - 10px)"; // Size of card length 33-10px
    var arrX = 5; // x
    var arrY = 5; // y
    let xRatio = (100/arrX);
    let yRatio = (100/arrY);

    // Make the x*y array
    var gameBoard = new Array(arrX);
    for (i = 0; i < gameBoard.length; i++)
    {
        gameBoard[i] = new Array(arrY);
    }

    // Initialize all values to 0
    for (i = 0; i < arrX; i++)
    {
        for (j = 0; j < arrY; j++)
        {
            gameBoard[i][j] = 0;
        }
    }

    //elems.forEach((elemnt)
    for (i = 0; i < elems.length; i++)
    {
        if (i != elems.length-1 && i != elems.length-2 && i != elems.length-3)
        {
            elemnt = elems[i];
            let y, x = 0;
            let rows = getRandInt(arrX);
            let columns = getRandInt(arrY);
                                                    
            while(gameBoard[columns][rows] === 1 || elems=== undefined)
            {
                rows = getRandInt(arrX);
                columns = getRandInt(arrY);
            }

            gameBoard[columns][rows] = 1;

            y = rows*yRatio
            x = columns*xRatio;
            var outX = "calc(";
            outX +=x;
            outX +="% - 0px)";

            var outY = "calc(";
            outY +=y;
            outY +="% + 300px)";
            elemnt.style.left = outX;
            elemnt.style.top = outY;
            elemnt.style.width = w;
            elemnt.style.height = h;

            console.log("left"+elemnt.style.left);
            console.log("top"+elemnt.style.top);
            //console.log(c.style);
        }
        else
        {
            elemnt = elems[i];
            cardName = elemnt.getAttribute('data-name');
            elemnt.remove();
            for (n = 0; n < elems.length; n++)
            {
                if (elems[n].getAttribute('data-name') == cardName)
                {
                    elems[n].remove();
                    winCondition--;
                }   
            }
        }
    }
    
    for(n = 0; n < elems.length; n++)
    {
        cardName = elems[n].getAttribute('data-name');
        console.log(cardName);
        // If the card is not a disaster or fix
        if(cardName != "fire" && cardName != "bomb" && cardName != "monster" && cardName != "water" && cardName != "kit" && cardName != "gun")
            winCondition++;
    }

<<<<<<< HEAD
    //Amount of pairs needed = city cards / 2
    winCondition = winCondition/2;
    console.log("wincon = "+winCondition);
    console.log("sizeofElems = "+ elems.length);
    return elems
=======
        gameBoard[columns][rows] = 1;

        y = rows*yRatio
        x = columns*xRatio;
        var outX = "calc(";
        outX +=x;
        outX +="% - 0px)";

        var outY = "calc(";
        outY +=y;
        outY +="% + 0px)";
        elemnt.style.left = outX;
        elemnt.style.top = outY;
        elemnt.style.width = w;
        elemnt.style.height = h;

        console.log("left"+elemnt.style.left);
        console.log("top"+elemnt.style.top);
   })
>>>>>>> 970bf9f19e4748e6cd1bd3ff7ef5dc44070242ed
}

// Add eventListener events to every card during initialization, and call flipCard() when clicked.
deck.forEach(c =>c.addEventListener('click', flipCard));

//Count the Players moves
function moveCounter(){
    moves++;
    counter.innerHTML = moves;
    //start timer on first click
    if(moves === 1){
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

    //restart time, matches, moves, disaster count
    moves = 0;
    counter = 0;
    sec = 0;
    min = 0;
    matches = 0;
    disasterCount = 0;
    gameover == false;
 
    clearInterval(Countup);
    document.getElementById("timer").innerHTML = "0:00";
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

    let win = new BrowserWindow({ width: 800, height: 600, modal:true, webPreferences:{nodeIntegration:true} })
    win.loadURL("file://" + __dirname + '/mainWindow.html')

}

function prefWindow() {
    const remote = require('electron').remote;
    const { BrowserWindow } = require('electron').remote

    let win = new BrowserWindow({ width: 800, height: 600, modal:true, webPreferences:{nodeIntegration:true} })
    win.loadURL("file://" + __dirname + '/prefs.html')

}
<<<<<<< HEAD
=======

function drag_start(event) {
    let style = window.getComputedStyle(event.target, null);
    event.dataTransfer.setData("text/plain",
        (parseInt(style.getPropertyValue("left"),10) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top"),10) - event.clientY));
}
function drag_over(event) {
    event.preventDefault();
    return false;
}
function drop(event) {
    let offset = event.dataTransfer.getData("text/plain").split(',');
    let dm = document.getElementById('drag');
    dm.style.left = (event.clientX + parseInt(offset[0],10)) + 'px';
    dm.style.top = (event.clientY + parseInt(offset[1],10)) + 'px';
    event.preventDefault();
    return false;
}
let dm = document.getElementById('drag');
dm.addEventListener('dragstart',drag_start,false);
document.body.addEventListener('dragover',drag_over,false);
document.body.addEventListener('drop',drop,false);





>>>>>>> 970bf9f19e4748e6cd1bd3ff7ef5dc44070242ed
