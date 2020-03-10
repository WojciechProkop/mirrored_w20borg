
//scripts.js

// Sound constructor
/*
Attribution licenses:
https://creativecommons.org/licenses/by/3.0/
flipCard sound obtained from:
https://freesound.org/people/f4ngy/sounds/240776/

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
let prevCard = null;
let flips = 0;


//for move counter
let moves = 0;
let counter = document.querySelector(".moves");
let blocked = false; // If false, user can flip. If true, user is locked out from playing
randomize();

//initialize timer
var sec = 0, min = 0;
document.getElementById("timer").innerHTML = "time: 0 min 0 sec";

//count matches
var matches = 0;
let gameover = false;

// associate reset() with html button id="reset"
document.getElementById("reset").onclick = reset;

function flipCard()
{
    if(blocked)return;
    sFlipCard.play();
    //sFireHazard.play();
    //timer start on first move
    if (moves === 0){
        startTimer();
    }
    moves++;
    //end of timer

    flips += 1;
    this.classList.toggle('flip');
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
                console.log("Won");
                gameover = true;
                finalTime = document.getElementById("timer").innerHTML;
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
        this.classList.toggle('flip');
        prevCard.classList.toggle('flip');
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

function getRandInt(max)
{
    return Math.floor(Math.random()*max);
}

// Shuffle the board
function randomize()
{
    let elems = document.querySelectorAll(".memCard");
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

    elems.forEach((elemnt) =>{
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

const nameList = [
    'Time', 'Past', 'Future', 'Dev',
    'Fly', 'Flying', 'Soar', 'Soaring', 'Power', 'Falling',
    'Fall', 'Jump', 'Cliff', 'Mountain', 'Rend', 'Red', 'Blue',
    'Green', 'Yellow', 'Gold', 'Demon', 'Demonic', 'Panda', 'Cat',
    'Kitty', 'Kitten', 'Zero', 'Memory', 'Trooper', 'XX', 'Bandit',
    'Fear', 'Light', 'Glow', 'Tread', 'Deep', 'Deeper', 'Deepest',
    'Mine', 'Your', 'Worst', 'Enemy', 'Hostile', 'Force', 'Video',
    'Game', 'Donkey', 'Mule', 'Colt', 'Cult', 'Cultist', 'Magnum',
    'Gun', 'Assault', 'Recon', 'Trap', 'Trapper', 'Redeem', 'Code',
    'Script', 'Writer', 'Near', 'Close', 'Open', 'Cube', 'Circle',
    'Geo', 'Genome', 'Germ', 'Spaz', 'Shot', 'Echo', 'Beta', 'Alpha',
    'Gamma', 'Omega', 'Seal', 'Squid', 'Money', 'Cash', 'Lord', 'King',
    'Duke', 'Rest', 'Fire', 'Flame', 'Morrow', 'Break', 'Breaker', 'Numb',
    'Ice', 'Cold', 'Rotten', 'Sick', 'Sickly', 'Janitor', 'Camel', 'Rooster',
    'Sand', 'Desert', 'Dessert', 'Hurdle', 'Racer', 'Eraser', 'Erase', 'Big',
    'Small', 'Short', 'Tall', 'Sith', 'Bounty', 'Hunter', 'Cracked', 'Broken',
    'Sad', 'Happy', 'Joy', 'Joyful', 'Crimson', 'Destiny', 'Deceit', 'Lies',
    'Lie', 'Honest', 'Destined', 'Bloxxer', 'Hawk', 'Eagle', 'Hawker', 'Walker',
    'Zombie', 'Sarge', 'Capt', 'Captain', 'Punch', 'One', 'Two', 'Uno', 'Slice',
    'Slash', 'Melt', 'Melted', 'Melting', 'Fell', 'Wolf', 'Hound',
    'Legacy', 'Sharp', 'Dead', 'Mew', 'Chuckle', 'Bubba', 'Bubble', 'Sandwich', 'Smasher', 'Extreme', 'Multi',
    'Universe', 'Ultimate', 'Death', 'Ready', 'Monkey', 'Elevator', 'Wrench', 'Grease', 'Head', 'Theme',
    'Grand', 'Cool', 'Kid', 'Boy', 'Girl', 'Vortex', 'Paradox'
];

let finalName = "";


function generate(){
    document.getElementById("nameplace").innerHTML = randName();
    sNameGenerate.play();

}

function randName(){
    finalName = nameList[Math.floor( Math.random() * nameList.length )];
    finalName += nameList[Math.floor( Math.random() * nameList.length )];
    if ( Math.random() > 0.5 ) {
        finalName += nameList[Math.floor( Math.random() * nameList.length )];
    }
    return finalName;
};

function generate(){
    document.getElementById("nameplace").innerHTML = randName();
}

function randName(){
    finalName = nameList[Math.floor( Math.random() * nameList.length )];
    finalName += nameList[Math.floor( Math.random() * nameList.length )];
    if ( Math.random() > 0.5 ) {
        finalName += nameList[Math.floor( Math.random() * nameList.length )];
    }
    return finalName;
};

//timer
function startTimer()
{
    var Countup = setInterval(function(){
        ++sec;
        //document.getElementById("matches").innerHTML = "matches: "+matches;
        document.getElementById("timer").innerHTML = "time: "+min+" min "+sec+" sec";
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
    sResetGame.play();

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