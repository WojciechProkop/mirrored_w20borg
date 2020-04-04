
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

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
        this.sound.play();
    }
    this.stop = function () {
        this.sound.pause();
    }
}

sFlipCard = new sound("flip_card.wav");
sFireHazard = new sound("fireHazard.wav");
sNameGenerate = new sound("nameGenerate.wav");
sResetGame = new sound("resetGame.wav");
var init = 0;
var isSet = 0;
var deck = document.querySelectorAll(".memCard");
let winCondition = 0;
let unscaled_width = 0;
let unscaled_height = 0;
var board_max_x = 0;
var board_max_y = 0;
deck = randomize(deck);

let prevCard = null;
let flips = 0;
const disasterDeck = [];

//for move counter
let moves = 0;
let counter = document.querySelector(".moves");
let blocked = false; // If false, user can flip. If true, user is locked out from playing

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

function flipCard() {
    if (blocked) return;

    //timer start on first move
    if (moves === 1) {
        startTimer();
    }
    moves++;
    //end of timer
    flips += 1;
    fixFlipped = 0;
    this.classList.toggle('flip');

    // If this card is a disaster add it to the disaster list and increase disaster count
    if (this.dataset.name === "fire") {
        sFireHazard.play();
        this.classList.toggle('flip');
        this.classList.toggle('flip');
        disasterDeck.push(this.dataset.name);
        this.removeEventListener('click', flipCard);
        disasterCount ++;
        increase_disaster();
        disasterCounter(disasterCount);

    }

    if (disasterDeck.length > 0 && this.dataset.name === "water") {
        let i;
        fixFlipped = 0;
        for (i = 0; i < disasterDeck.length; i++) {
            if (disasterDeck[i] === 'fire') {
                this.removeEventListener('click', flipCard);
                disasterCount --;
                decrease_disaster();
                disasterCounter(disasterCount);
                disasterDeck.pop();
                flips = 2;
                fixFlipped = 1;
            }
        }
    }

    if (disasterCount > 1) {
        gameover = true;
        defeat(disasterCount);
    }

    // If this is not the first click
    if (prevCard != null) {   // If the this card and the previous card share the same name remove the event
        // listener functionality, disabling the card face up.
        if (this.dataset.name === prevCard.dataset.name && prevCard != this) {
            this.removeEventListener('click', flipCard);
            prevCard.removeEventListener('click', flipCard);
            matches++;
            prevCard = null
            flips = 0;
            //IF ALL MATCHED
            if (matches === winCondition) {
                gameover = true;
                finalTime = document.getElementById("timer").innerHTML;
                victory(finalTime);
                //document.getElementById("finTime").innerHTML = finalTime;
            }

        }
    }
    // If you flipped two cards with no match, then flip them back down.
    if (flips >= 2) {
        blocked = true;
        // Without this delay, last card "flipped" flips back too fast to
        // be seen.
        if (prevCard != this) {
            setTimeout(() => {
                if (this.dataset.name != "fire" && fixFlipped === 0) {
                    this.classList.toggle('flip');
                }
                if (prevCard != null) {
                    if (prevCard.dataset.name != "fire") {
                        prevCard.classList.toggle('flip');
                    }
                }
                prevCard = null;
                blocked = false;
            }, 1000);
        }
        setTimeout(() => {
            blocked = false;
            flips = 0;
            prevCard = null;
        }, 1000);

    }
    else { prevCard = this }
}
function getRandInt(max) {
    return Math.floor(Math.random() * max);
}




// Shuffle the board if there are any overlaps. Try to maintain
// good positioning on the screen, so the elements do not leave the game boundary.
function randomize(deck) {
    let board = document.getElementById("board");
    var domBoard = board.getBoundingClientRect();
    let elems = [];
    elems = deck;

    unscaled_height = domBoard.height;
    unscaled_width = domBoard.width;

    //Remove last n cards from the deck, plus their corresponding pairs.
    if (init === 0) {
        var removeLastNCards = 0;
        removeLastNCards = 0;
        for (i = elems.length - removeLastNCards; i < elems.length; i++) {
            element = elems[i];
            cardName = element.getAttribute('data-name');
            element.remove();
            for (n = 0; n < elems.length; n++) {
                if (elems[n].getAttribute('data-name') == cardName) {
                    elems[n].remove();
                }
            }
            winCondition = winCondition - 2;
        }
    }

    // Calculate how many cards we have left
    let was_odd = 0;
    let cards = elems.length;
    if (cards % 2 == 1) {
        cards++;
        was_odd = 1;
    }

    // For all the elements, get their rectangles.
    // Calculate their relative size to the viewport
    // And if cards overlap or if the menu overlaps
    // Determine another area to put the card
    // If no suitable matches are found after n iterations
    // It puts the card wherever it may, just so the program doesn't
    // hang.
    for (i = 0; i < elems.length; i++) {
        element = elems[i];
        domCard = element.getBoundingClientRect();
        var output = 0;
        var outputCardOverlap = 0;
        var rec_depth = 0;
        output = checkOverlap(element);
        while ((output === 1 || init === 0 || outputCardOverlap === 1) && rec_depth < 4) {
            var top = "calc(";
            var left = "calc(";
            temp = 0;
            if (init === 0) {
                var tw;
                var th;
                tw = Math.floor(unscaled_width / domCard.width);
                th = Math.floor(unscaled_height / domCard.height);
                if (isSet === 0) {
                    if (tw != 0 && board_max_x != Infinity) {
                        board_max_x = Math.floor(unscaled_width / domCard.width);
                        board_max_y = Math.floor(unscaled_height / domCard.height);
                        isSet++;
                    }
                }
            }

            // Set the left and top properties
            temp = Math.floor(Math.random() * board_max_y)
            temp = temp * Math.floor((domCard.height / unscaled_height) * 100);
            top = top + temp;
            top = top + "% - 0px)";

            temp = Math.floor(Math.random() * board_max_x)
            temp = temp * Math.floor((domCard.width / unscaled_width) * 100);
            left = left + temp;
            left = left + "% - 0px)"

            element.style.top = top;
            element.style.left = left;
            output = checkOverlap(element);
            outputCardOverlap = checkOverlapBetweenCards(element);
            rec_depth++;
        }
        rec_depth = 0;
    }
    // Determine how many matches we need to win. Only do this at game start!qa
    if (init === 0) {
        for (n = 0; n < elems.length; n++) {
            cardName = elems[n].getAttribute('data-name');
            // If the card is not a disaster or fix
            if (cardName != "fire" && cardName != "bomb" && cardName != "monster" && cardName != "water" && cardName != "kit" && cardName != "gun")
                winCondition++;
        }
        //Amount of pairs needed = city cards / 2
        winCondition = winCondition / 2;
        init++;
    }
    return elems
}




// Add eventListener events to every card during initialization, and call flipCard() when clicked.
deck.forEach(c => c.addEventListener('click', flipCard));

//Count the Players moves
function moveCounter() {
    moves++;
    counter.innerHTML = moves;
    //start timer on first click
    if (moves === 1) {
        sec = 0;
        min = 0;
        startTimer(); //insert timer here
    }
}

//Counts the Number of disasters
function disasterCounter(disasterCount) {
    document.getElementById("disasters").innerHTML = "" + disasterCount;

}
/*
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

*/
//timer
function startTimer() {
    var Countup = setInterval(function () {
        ++sec;
        //document.getElementById("matches").innerHTML = "matches: "+matches;
        document.getElementById("timer").innerHTML = "" + min + " : " + sec;
        //if all cards match
        if (sec == 59) {
            min++;
            sec = -1;
        }
        if (gameover == true) {
            document.getElementById("timer").innerHTML = finalTime;
        }
    }, 1000)
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

    let win = new BrowserWindow({ width: 800, height: 600, modal: true, webPreferences: { nodeIntegration: true } })
    win.loadURL("file://" + __dirname + '/Victory.html?user=' + finalTime)
    //let newWin = window.open("Victory.html?user=" + finalTime , "Victory", "width=400,height=400");
}

function defeat(disasterCount) {
    let newWin = window.open("defeat.html", "Defeat", "width=400,height=400");
    newWin.document.getElementById("disastercount").innerHTML = '5';

}

function loadleaderboard() {
    const remote = require('electron').remote;
    const { BrowserWindow } = require('electron').remote

    let win = new BrowserWindow({ width: 800, height: 600, modal: true, webPreferences: { nodeIntegration: true } })
    win.loadURL("file://" + __dirname + '/leaderboard.html')

}

function mainmenu() {
    const remote = require('electron').remote;
    const { BrowserWindow } = require('electron').remote

    let win = new BrowserWindow({ width: 800, height: 600, modal: true, webPreferences: { nodeIntegration: true } })
    win.loadURL("file://" + __dirname + '/mainWindow.html')

}

function prefWindow() {
    const remote = require('electron').remote;
    const { BrowserWindow } = require('electron').remote

    let win = new BrowserWindow({ width: 800, height: 600, modal: true, webPreferences: { nodeIntegration: true } })
    win.loadURL("file://" + __dirname + '/prefs.html')

}


function drag_start(event) {
    let style = window.getComputedStyle(event.target, null);
    event.dataTransfer.setData("text/plain",
        (parseInt(style.getPropertyValue("left"), 10) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top"), 10) - event.clientY));

}
function drag_over(event) {
    event.preventDefault();
    return false;
}
function drop(event) {
    let offset = event.dataTransfer.getData("text/plain").split(',');
    let dm = document.getElementById('drag');
    dm.style.left = (event.clientX + parseInt(offset[0], 10)) + 'px';
    dm.style.top = (event.clientY + parseInt(offset[1], 10)) + 'px';
    event.preventDefault();
    randomize(deck);
    return false;
}
let dm = document.getElementById('drag');
dm.addEventListener('dragstart', drag_start, false);
document.body.addEventListener('dragover', drag_over, false);
document.body.addEventListener('drop', drop, false);


/*
    Function purpose: Determine the overlap between the menu and any cards.
    Return of 1 means there is overlap, return of 0 means there is no overlap.

    For further reading please access:
    https://stackoverflow.com/questions/23302698/java-check-if-two-rectangles-overlap-at-any-point
    in particular the solution by ThePatelGuy
*/
function checkOverlap(card_elem) {
    var domMenu;
    var domCard;
  
function increase_disaster() {
    let elem = document.getElementById("fill-bar");
    width+=20;
    elem.style.width = width + "%";
}

function decrease_disaster() {
let elem = document.getElementById("fill-bar");
width-=20;
elem.style.width = width + "%";
}



    if (card_elem.style.left != undefined) {

        // get domRectangles for card and the menu
        domMenu = document.getElementById("drag");
        domMenu = domMenu.getBoundingClientRect();
        domCard = card_elem.getBoundingClientRect();

    }
    // Declare the two rectangles
    var rect1 = { x: 0, y: 0, width: 0, height: 0 }
    var rect2 = { x: 0, y: 0, width: 0, height: 0 }

    if (init > 0) {
        rect1.x = domCard.x;
        rect1.y = domCard.y;
        rect1.width = domCard.width;
        rect1.height = domCard.height;

        rect2.x = domMenu.x;
        rect2.y = domMenu.y;
        rect2.width = domMenu.width;
        rect2.height = domMenu.width;


        if (rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y) {
            return 1; // There was an intersection
        }
        return 0 // there was no intersection

    }
}

/*
    Check if there is overlap between this card and all other cards in the array.
    The function works the same as checkOverlap
*/
function checkOverlapBetweenCards(card_elem) {
    var cards = deck; // do not overwrite deck
    var dom_card_elem = card_elem.getBoundingClientRect();
    var dom_other_elem;

    var rect1 = { x: 0, y: 0, width: 0, height: 0 }
    var rect2 = { x: 0, y: 0, width: 0, height: 0 }

    for (i = 0; i < cards.length; i++) {
        dom_other_elem = cards[i];
        dom_other_elem = dom_other_elem.getBoundingClientRect();
        if (dom_other_elem != card_elem) {
            if (init > 0) {
                rect1.x = dom_card_elem.x;
                rect1.y = dom_card_elem.y;
                rect1.width = dom_card_elem.width;
                rect1.height = dom_card_elem.height;

                rect2.x = dom_other_elem.x;
                rect2.y = dom_other_elem.y;
                rect2.width = dom_other_elem.width;
                rect2.height = dom_other_elem.width;

                if (rect1.x < rect2.x + rect2.width &&
                    rect1.x + rect1.width > rect2.x &&
                    rect1.y < rect2.y + rect2.height &&
                    rect1.y + rect1.height > rect2.y) {
                    return 1; // There was an intersection
                }
                return 0 // there was no intersection

            }
        }
    }
}